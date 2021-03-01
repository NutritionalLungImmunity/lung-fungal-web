import vtkOpenGLHardwareSelector from 'vtk.js/Sources/Rendering/OpenGL/HardwareSelector';
import { FieldAssociations } from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';

/*
 * Adapted from https://kitware.github.io/vtk-js/examples/HardwareSelector.html
*/
export default class Picker {
  constructor(renderer, renderWindow) {
    const rw = renderWindow.getInteractor().getView();
    this.selector = vtkOpenGLHardwareSelector.newInstance();
    this.selector.setFieldAssociation(
      FieldAssociations.FIELD_ASSOCIATION_POINTS,
    );
    this.selector.attach(rw, renderer);

    this.renderer = renderer;
    this.renderWindow = renderWindow;
    this.openGLRenderWindow = rw;
  }

  static eventToWindowXY(event) {
    // // TODO: use element size rather than window size
    // const { clientX, clientY } = event;
    // const [width, height] = this.openGLRenderWindow.getSize();
    // const x = Math.round((width * clientX) / window.innerWidth);
    // const y = Math.round(height * (1 - clientY / window.innerHeight)); // Need to flip Y
    const { x, y } = event.position;
    return [x, y];
  }

  static processSelections(selections) {
    console.log(selections.length);
    if (!selections || selections.length === 0) {
      return null;
    }

    console.log(selections[0].getProperties());
    return selections[0].getProperties();
  }

  pick(event) {
    // const interactor = this.renderWindow.getInteractor();
    // if (interactor.isAnimating()) {
    //   return null;
    // }

    const [x, y] = Picker.eventToWindowXY(event);
    this.selector.setArea(x, y, x, y);
    this.selector.releasePixBuffers();

    if (this.selector.captureBuffers()) {
      return Picker.processSelections(this.selector.generateSelection(x, y, x, y));
    }
    return null;
  }
}
