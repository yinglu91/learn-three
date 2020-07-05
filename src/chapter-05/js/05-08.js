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

    this.radiusTop = 20;
    this.radiusBottom = 20;
    this.height = 20;
    this.radialSegments = 8;
    this.heightSegments = 8;
    this.openEnded = false;
    this.thetaStart = 0;
    this.thetaLength = 2 * Math.PI;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function () {
        return new THREE.CylinderGeometry(
          controls.radiusTop,
          controls.radiusBottom,
          controls.height,
          controls.radialSegments,
          controls.heightSegments,
          controls.openEnded,
          controls.thetaStart,
          controls.thetaLength
        );
      });
    };
  })();

  // create the GUI with the specific settings for this geometry
  const gui = new dat.GUI();
  gui.add(controls, 'radiusTop', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'radiusBottom', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'openEnded').onChange(controls.redraw);
  gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);

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
