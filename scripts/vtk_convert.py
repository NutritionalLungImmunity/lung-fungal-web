from vtk import (
    vtkPolyDataReader,
    vtkStructuredPointsReader,
    vtkXMLImageDataWriter,
    vtkXMLPolyDataWriter,
)
from requests.adapters import HTTPAdapter
from numpy import percentile
import girder_client
import os
import click
import re
import collections
import json

gc = None


@click.command()
@click.option('--input-folder-id', required=True, help='Source Folder ID')
@click.option('--output-folder-id', required=True, help='Destination Folder ID')
@click.option('--api-key', required=True, prompt=True, help='API Key from Girder')
@click.option(
    '--hostname',
    default='https://data.computational-biology.org/api/v1/',
    help='URL, make sure to include /api/v1/ at the end',
)
def main(input_folder_id, output_folder_id, api_key, hostname):
    global gc
    gc = girder_client.GirderClient(apiUrl=hostname)
    gc.authenticate(apiKey=api_key)

    macrophage_states = {}
    macrophage_summary = {}
    spore_healths = {}
    spore_aggregate = {
        'x': [],
        'min': [],
        'q1': [],
        'med': [],
        'q3': [],
        'max': []
    }

    with gc.session() as s:
        s.mount(hostname, HTTPAdapter(max_retries=5))

        gmsFolders = gc.get(
            'folder', parameters={'parentType': 'folder', 'parentId': input_folder_id}
        )

        gmsFiles = map(getItems, gmsFolders)

        for gms in gmsFiles:
            for file in gms:
                oldName = file['name']
                print(f'downloading {oldName}')
                try:
                    gc.downloadFile(file['_id'], os.path.abspath(oldName))

                    # oldName looks like geometry_0.vtk
                    nameMatch = re.match(r'^([a-zA-Z]+)_([0-9]+)\.vtk$', oldName)
                    fileType = nameMatch.group(1)
                    num = int(nameMatch.group(2))

                    if fileType == 'geometry':
                        reader = vtkStructuredPointsReader()
                        reader.ReadAllScalarsOn()
                        writer = vtkXMLImageDataWriter()
                    elif fileType == 'spore':
                        reader = vtkPolyDataReader()
                        writer = vtkXMLPolyDataWriter()
                    elif fileType == 'macrophage':
                        reader = vtkPolyDataReader()
                        writer = vtkXMLPolyDataWriter()
                    else:
                        raise Exception('Invalid File: {}'.format(oldName))

                    reader.SetFileName(oldName)
                    reader.Update()
                    data = reader.GetOutput()

                    name = f'{fileType}_{num:03}.vti'
                    print(f'writing {name}')

                    writer.SetFileName(name)
                    writer.SetCompressorTypeToZLib()
                    writer.SetInputData(data)
                    writer.Update()

                    timepointFolder = gc.post(
                        'folder/',
                        parameters={
                            'parentType': 'folder',
                            'parentId': output_folder_id,
                            'name': f'{num:03}',
                            'reuseExisting': True,
                        },
                    )

                    gc.uploadFileToFolder(timepointFolder['_id'], name)

                    if fileType == 'spore':
                        reader.ReadAllScalarsOn()
                        reader.Update()
                        pointdata = reader.GetOutput().GetPointData()
                        spore_healths = extractStats(spore_healths, pointdata.GetArray('GLOBAL_IDS'), pointdata.GetArray('Health'), num)
                        quartiles = percentile(pointdata.GetArray('Health'), [0, 25, 50, 75, 100])
                        spore_aggregate['x'].append(num)
                        spore_aggregate['min'].append(quartiles[0])
                        spore_aggregate['q1'].append(quartiles[1])
                        spore_aggregate['med'].append(quartiles[2])
                        spore_aggregate['q3'].append(quartiles[3])
                        spore_aggregate['max'].append(quartiles[4])
                    elif fileType == 'macrophage':
                        reader.ReadAllScalarsOn()
                        reader.Update()
                        pointdata = reader.GetOutput().GetPointData()
                        states = pointdata.GetArray('State')
                        macrophage_states = extractStats(macrophage_states, pointdata.GetArray('GLOBAL_IDS'), states, num)
                        cnt = collections.Counter()
                        for i in range(states.GetNumberOfTuples()):
                            cnt[states.GetTuple1(i)] += 1
                        for state in cnt:
                            if state not in macrophage_summary:
                                macrophage_summary[state] = {
                                    'x': [],
                                    'y': []
                                }
                            macrophage_summary[state]['x'].append(num)
                            macrophage_summary[state]['y'].append(cnt[state])

                except girder_client.HttpError:
                    print('ERROR DOWNLOADING')

    for key in macrophage_states:
        coords = sortData(macrophage_states[key]['x'], macrophage_states[key]['y'])
        macrophage_states[key]['x'] = coords[0]
        macrophage_states[key]['y'] = coords[1]

    for key in macrophage_summary:
        amts = sortData(macrophage_summary[key]['x'], macrophage_summary[key]['y'])
        macrophage_summary[key]['x'] = amts[0]
        macrophage_summary[key]['y'] = amts[1]

    for key in spore_healths:
        coords = sortData(spore_healths[key]['x'], spore_healths[key]['y'])
        spore_healths[key]['x'] = coords[0]
        spore_healths[key]['y'] = coords[1]

    coords = list(zip(spore_aggregate['x'], spore_aggregate['min'], spore_aggregate['q1'], spore_aggregate['med'], spore_aggregate['q3'], spore_aggregate['max']))
    coords.sort(key = lambda tup: tup[0])
    coords = list(zip(*coords))
    spore_aggregate['x'] = coords[0]
    spore_aggregate['min'] = coords[1]
    spore_aggregate['q1'] = coords[2]
    spore_aggregate['med'] = coords[3]
    spore_aggregate['q3'] = coords[4]
    spore_aggregate['max'] = coords[5]

    with open('macrophage_states.json', 'w') as outfile:  
        json.dump(macrophage_states, outfile)
    with open('spore_healths.json', 'w') as outfile:  
        json.dump(spore_healths, outfile)
    with open('spore_aggregate.json', 'w') as outfile:
        json.dump(spore_aggregate, outfile)
    with open('macrophage_summary.json', 'w') as outfile:  
        json.dump(macrophage_summary, outfile)
    gc.uploadFile(output_folder_id, open('macrophage_states.json', 'r') , 'macrophage_states.json', os.path.getsize('macrophage_states.json'), parentType='folder')
    gc.uploadFile(output_folder_id, open('spore_healths.json', 'r') , 'spore_healths.json', os.path.getsize('spore_healths.json'), parentType='folder')
    gc.uploadFile(output_folder_id, open('spore_aggregate.json', 'r') , 'spore_aggregate.json', os.path.getsize('spore_aggregate.json'), parentType='folder')
    gc.uploadFile(output_folder_id, open('macrophage_summary.json', 'r') , 'macrophage_summary.json', os.path.getsize('macrophage_summary.json'), parentType='folder')


def getItems(folderData):
    items = gc.get('item', parameters={'folderId': folderData['_id'], 'limit': 0})
    return map(getFiles, items)


def getFiles(item):
    print(f'getting {item["name"]}')
    files = gc.get(f'item/{item["_id"]}/files')
    return files[0]

def extractStats(stats_json, global_ids, stats, time):
    for i in range(global_ids.GetNumberOfTuples()):
        global_id = global_ids.GetTuple1(i)
        if global_id in stats_json:
            point = stats_json[global_id]
        else:
            point = {
                'x': [],
                'y': [],
            }
        point['x'].append(time)
        point['y'].append(stats.GetTuple1(i))
        stats_json[global_id] = point
    return stats_json

def sortData(x, y):
    coords = list(zip(x, y))
    coords.sort(key = lambda tup: tup[0])
    return list(zip(*coords))

if __name__ == '__main__':
    main()
