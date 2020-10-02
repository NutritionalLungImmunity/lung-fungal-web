import http from '@/http';
import State from '@/data/state';

class Simulation {
  constructor(timeSteps) {
    this.timeSteps = timeSteps;
  }

  static async load(id) {
    const folders = (await http.get('folder', {
      params: {
        parentType: 'folder',
        parentId: id,
      },
    })).data.filter((f) => /\d{3}/.test(f.name));

    const timeStepIds = [];
    for (let i = 0; i < Object.keys(folders).length; i += 1) {
      const folder = folders[i];
      timeStepIds[parseInt(folder.name, 10)] = folder._id;
    }
    return new Simulation(
      await Promise.all(
        timeStepIds.map((timeStepId) => State.load(timeStepId)),
      ),
    );
  }
}

export default Simulation;
