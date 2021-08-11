import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';

import http from '@/http';

class State {
  constructor(id, time, afumigatus, geometry, macrophage, molecules, neutrophil, pneumocyte) {
    this.id = id;
    this.time = time;
    this.afumigatus = State.loadPolyData(afumigatus);
    this.geometry = State.loadImageData(geometry);
    this.macrophage = State.loadPolyData(macrophage);
    this.molecules = State.loadImageData(molecules);
    this.neutrophil = State.loadPolyData(neutrophil);
    this.pneumocyte = State.loadPolyData(pneumocyte);
  }

  static async load(id) {
    const [time,
      afumigatus,
      geometry,
      macrophage,
      molecules,
      neutrophil,
      pneumocyte] = await Promise.all([
      State.getTime(id),
      State.loadFile(id, 'afumigatus_001.vtp'),
      State.loadFile(id, 'geometry_001.vti'),
      State.loadFile(id, 'macrophage_001.vtp'),
      State.loadFile(id, 'molecules_001.vti'),
      State.loadFile(id, 'neutrophil_001.vtp'),
      State.loadFile(id, 'pneumocyte_001.vtp'),
    ]);
    return new State(id, time, afumigatus, geometry, macrophage, molecules, neutrophil, pneumocyte);
  }

  static async getTime(folderId) {
    const folder = await http.get(`folder/${folderId}`);
    return folder.data.meta.time || null;
  }

  static async loadFile(folderId, name) {
    let item;
    let file;
    try {
      [item] = (await http.get('item', {
        params: {
          folderId,
          name,
          limit: 1,
        },
      })).data;
    } catch (e) {
      console.error(`Error loading items from ${folderId}`); // eslint-disable-line no-console
      throw e;
    }
    try {
      [file] = (await http.get(`item/${item._id}/files`, {
        params: {
          limit: 1,
        },
      })).data;
    } catch (e) {
      console.error(`Error loading files from ${item._id}`); // eslint-disable-line no-console
      throw e;
    }
    try {
      return (await http.get(`file/${file._id}/download`, {
        responseType: 'arraybuffer',
      })).data;
    } catch (e) {
      console.error(`Error loading data from ${file._id}`); // eslint-disable-line no-console
      throw e;
    }
  }

  static loadImageData(buffer) {
    const imageDataReader = vtkXMLImageDataReader.newInstance();
    const success = imageDataReader.parseAsArrayBuffer(buffer);
    if (!success) {
      throw new Error('Could not load image data');
    }
    return imageDataReader.getOutputData(0);
  }

  static loadPolyData(buffer) {
    const polyDataReader = vtkXMLPolyDataReader.newInstance();
    const success = polyDataReader.parseAsArrayBuffer(buffer);
    if (!success) {
      throw new Error('Could not load poly data');
    }
    const ds = polyDataReader.getOutputData(0);
    const values = new Uint8Array(ds.getNumberOfPoints());
    values.fill(1);
    ds.getPointData().addArray(vtkDataArray.newInstance({ name: 'scale', values }));
    return polyDataReader.getOutputData(0);
  }

  countCells(cellType, array = null, filter = (d) => d) {
    const polyData = this[cellType];
    if (array === null) {
      return polyData.getNumberOfPoints();
    }
    const pointData = polyData.getPointData();
    const data = pointData.getArrayByName(array).getData();
    return data.filter(filter).length;
  }
}

export default State;
