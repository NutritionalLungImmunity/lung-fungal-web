from vtk import (
    vtkPolyDataReader,
    vtkStructuredPointsReader,
    vtkXMLImageDataWriter,
    vtkXMLPolyDataWriter,
)
from requests.adapters import HTTPAdapter
import girder_client
import os
import click
import re

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
                            'name': num,
                            'reuseExisting': True,
                        },
                    )

                    gc.uploadFileToFolder(timepointFolder['_id'], name)

                except girder_client.HttpError:
                    print('ERROR DOWNLOADING')


def getItems(folderData):
    items = gc.get('item', parameters={'folderId': folderData['_id'], 'limit': 0})
    return map(getFiles, items)


def getFiles(item):
    print(f'getting {item["name"]}')
    files = gc.get(f'item/{item["_id"]}/files')
    return files[0]


if __name__ == '__main__':
    main()
