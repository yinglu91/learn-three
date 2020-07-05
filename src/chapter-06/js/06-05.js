function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const scene = new THREE.Scene();
  initDefaultLighting(scene);
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -30;

  // setup the control gui
  const controls = new (function () {
    this.appliedMaterial = applyMeshNormalMaterial;
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.amount = 2;
    this.bevelThickness = 2;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;

    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function () {
        const options = {
          amount: controls.amount,
          bevelThickness: controls.bevelThickness,
          bevelSize: controls.bevelSize,
          bevelSegments: controls.bevelSegments,
          bevelEnabled: controls.bevelEnabled,
          curveSegments: controls.curveSegments,
          steps: controls.steps,
        };

        const geom = new THREE.ExtrudeGeometry(drawShape(), options);
        geom.applyMatrix(new THREE.Matrix4().makeScale(0.05, 0.05, 0.05));
        geom.center();

        return geom;
      });
    };
  })();

  const gui = new dat.GUI();
  gui.add(controls, 'amount', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSize', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.redraw);
  gui.add(controls, 'bevelEnabled').onChange(controls.redraw);
  gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.redraw);
  gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.redraw);

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

  function drawShape() {
    const svgString = document.querySelector('#batman-path').getAttribute('d');

    const shape = transformSVGPathExposed(svgString);

    // return the shape
    return shape;
  }

  controls.redraw();

  let step = 0;
  render();

  function render() {
    stats.update();

    step += 0.005;
    controls.mesh.rotation.y = step;
    controls.mesh.rotation.x = step;
    controls.mesh.rotation.z = step;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
