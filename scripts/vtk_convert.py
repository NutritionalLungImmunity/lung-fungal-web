from vtk import vtkPolyDataReader, vtkStructuredPointsReader, \
    vtkXMLImageDataWriter, vtkXMLPolyDataWriter
from girder_client import GirderClient
import os
import click
import re

@click.command()
@click.option('--inputfolderid', required=True, prompt=True, help='Source Folder ID')
@click.option('--outputfolderid', required=True, prompt=True, help='Destination Folder ID')
@click.option('--apikey', required=True, prompt=True, help='API Key from Girder')
@click.option('--hostname', default='https://data.computational-biology.org/api/v1/', prompt=True, help='URL, make sure to include /api/v1/ at the end')
def main(inputfolderid, outputfolderid, apikey, hostname):
  gc = GirderClient(apiUrl=hostname)
  gc.authenticate(apiKey=apikey)

  def getFiles(itemData):
    print('getting ' + itemData['name'])
    dataFiles = gc.get('item/' + itemData['_id'] + '/files')
    return dataFiles[0]

  def getItems(folderData):
    folderInfo = gc.get('folder/' + folderData['_id'] + '/details')
    folderItems = gc.get('item',
      parameters={
        'folderId': folderData['_id'],
        'limit': folderInfo['nItems']
      })
    return map(getFiles, folderItems)

  gmsFolders = gc.get('folder',
    parameters={
      'parentType': 'folder',
      'parentId': inputfolderid,
    })

  gmsFileNames = map(getItems, gmsFolders)

  for row in gmsFileNames:
    for elem in row:
      oldName = elem['name']
      print('dowloading ' + oldName)
      try:
        gc.downloadFile(elem['_id'], os.path.abspath(oldName))

        reader = vtkPolyDataReader()
        writer = vtkXMLPolyDataWriter()
        fileType = ''
        if re.search("^geometry_", oldName):
          reader = vtkStructuredPointsReader()
          reader.ReadAllScalarsOn()
          writer = vtkXMLImageDataWriter()
          fileType = 'geometry_'
        elif re.search("^spore_", oldName):
          fileType = 'spore_'
        elif re.search("^macrophage_", oldName):
          fileType = 'macrophage_'
        else:
          raise Exception('Invalid File: {}'.format(oldName))

        reader.SetFileName(oldName)
        reader.Update()
        data = reader.GetOutput()

        end = oldName[len(fileType):]
        num = '00' + end[:len(end) - 4]
        fixed = num[len(num) - 3:]
        name = fileType + fixed + '.vti'
        print('writing ' + name)

        writer.SetFileName(name)
        writer.SetCompressorTypeToZLib()
        writer.SetInputData(data)
        writer.Update()

        timepointFolder = gc.post('folder/',
          parameters={
            'parentType': 'folder',
            'parentId': outputfolderid,
            'name': fixed,
            'reuseExisting': True
          })

        gc.uploadFileToFolder(timepointFolder['_id'], name)

      except girder_client.HttpError:
        print("ERROR DOWNLOADING")
        pass

if __name__ == '__main__':
  main()