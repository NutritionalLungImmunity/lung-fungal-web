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
@click.option(
    '--input-folder-id',
    required=True,
    help='Source Folder ID',
)
@click.option(
    '--output-folder-id',
    required=True,
    help='Destination Folder ID',
)
@click.option(
    '--api-key',
    required=True,
    prompt=True,
    help='API Key from Girder',
)
@click.option(
    '--hostname',
    default='https://data.computational-biology.org/api/v1/',
    help='URL, make sure to include /api/v1/ at the end',
)
def main(input_folder_id, output_folder_id, api_key, hostname):
    global gc
    gc = girder_client.GirderClient(apiUrl=hostname)
    gc.authenticate(apiKey=api_key)

    s = gc.session()
    s.mount(hostname, HTTPAdapter(max_retries=5))

    gmsFolders = gc.get(
        'folder',
        parameters={
            'parentType': 'folder',
            'parentId': input_folder_id,
        },
    )

    gmsFiles = map(getItems, gmsFolders)

    for gms in gmsFiles:
        for file in gms:
            oldName = file['name']
            print(f'downloading {oldName}')
            try:
                gc.downloadFile(
                    file['_id'], os.path.abspath(oldName)
                )

                reader = vtkPolyDataReader()
                writer = vtkXMLPolyDataWriter()
                if re.search('^geometry', oldName):
                    reader = vtkStructuredPointsReader()
                    reader.ReadAllScalarsOn()
                    writer = vtkXMLImageDataWriter()
                    fileType = 'geometry'
                elif re.search('^spore', oldName):
                    fileType = 'spore'
                elif re.search('^macrophage', oldName):
                    fileType = 'macrophage'
                else:
                    raise Exception(
                        'Invalid File: {}'.format(oldName)
                    )

                reader.SetFileName(oldName)
                reader.Update()
                data = reader.GetOutput()

                end = oldName[len(fileType):]
                num = '{:03d}'.format(int(end[1:-4]))
                name = f'{fileType}_{num}.vti'
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

                gc.uploadFileToFolder(
                    timepointFolder['_id'], name
                )

            except girder_client.HttpError:
                print('ERROR DOWNLOADING')


def getItems(folderData):
    items = gc.get(
        'item',
        parameters={
            'folderId': folderData['_id'],
            'limit': 0,
        },
    )
    return map(getFiles, items)

def getFiles(item):
    print(f'getting {item["name"]}')
    files = gc.get(
        f'item/{item["_id"]}/files'
    )
    return files[0]

if __name__ == '__main__':
    main()