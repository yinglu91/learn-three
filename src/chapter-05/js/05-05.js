function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  const scene = new THREE.Scene();
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -30;
  initDefaultLighting(scene);

  // setup the control parts of the ui
  const controls = new (function () {
    const self = this;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial;
    this.castShadow = true;
    this.groundPlaneVisible = true;

    const baseGeom = new THREE.BoxGeometry(4, 10, 10, 4, 4, 4);
    this.width = baseGeom.parameters.width;
    this.height = baseGeom.parameters.height;
    this.depth = baseGeom.parameters.depth;

    this.widthSegments = baseGeom.parameters.widthSegments;
    this.heightSegments = baseGeom.parameters.heightSegments;
    this.depthSegments = baseGeom.parameters.depthSegments;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function () {
        return new THREE.BoxGeometry(
          controls.width,
          controls.height,
          controls.depth,
          Math.round(controls.widthSegments),
          Math.round(controls.heightSegments),
          Math.round(controls.depthSegments)
        );
      });
    };
  })();

  // create the GUI with the specific settings for this geometry
  const gui = new dat.GUI();
  gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'depth', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'depthSegments', 0, 10).onChange(controls.redraw);
  // add a material section, so we can switch between materials
  gui
    .add(controls, 'appliedMaterial', {
      meshNormal: applyMeshNormalMaterial,
      meshStandard: applyMeshStandardMaterial,
    })
    .onChange(controls.redraw);

  gui.add(controls, 'castShadow').onChange(function (e) {
    controls.mesh.castShadow = e;
  });
  gui.add(controls, 'groundPlaneVisible').onChange(function (e) {
    groundPlane.material.visible = e;
  });

  // initialize the first redraw so everything gets initialized
  controls.redraw();

  let step = 0;

  // call the render function
  render();

  function render() {
    stats.update();

    step += 0.01;
    controls.mesh.rotation.y = step;
    controls.mesh.rotation.x = step;
    controls.mesh.rotation.z = step;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
