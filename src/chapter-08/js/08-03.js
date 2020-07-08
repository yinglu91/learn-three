function init() {
  // use the defaults
  const stats = initStats();
  const webGLRenderer = initRenderer();
  const scene = new THREE.Scene();
  const camera = initCamera(new THREE.Vector3(0, 40, 50));

  const knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3));
  // add the sphere to the scene
  scene.add(knot);

  let loadedMesh;

  // setup the control gui
  const controls = new (function () {
    // we need the first child, since it's a multimaterial
    this.radius = knot.geometry.parameters.radius;
    this.tube = 0.3;
    this.radialSegments = knot.geometry.parameters.radialSegments;
    this.tubularSegments = knot.geometry.parameters.tubularSegments;
    this.p = knot.geometry.parameters.p;
    this.q = knot.geometry.parameters.q;

    this.redraw = function () {
      // remove the old plane
      scene.remove(knot);
      // create a new one
      knot = createMesh(
        new THREE.TorusKnotGeometry(
          controls.radius,
          controls.tube,
          Math.round(controls.radialSegments),
          Math.round(controls.tubularSegments),
          Math.round(controls.p),
          Math.round(controls.q)
        )
      );
      // add it to the scene.
      scene.add(knot);
    };

    this.save = function () {
      const result = knot.toJSON();
      localStorage.setItem("json", JSON.stringify(result));
      console.log(localStorage.getItem("json"));
    };

    this.load = function () {
      scene.remove(loadedMesh);

      const json = localStorage.getItem("json");

      if (json) {
        const loadedGeometry = JSON.parse(json);
        const loader = new THREE.ObjectLoader();

        loadedMesh = loader.parse(loadedGeometry);
        loadedMesh.position.x -= 40;
        scene.add(loadedMesh);
      }
    };
  })();

  const gui = new dat.GUI();
  const ioGui = gui.addFolder("Save & Load");
  ioGui.add(controls, "save").onChange(controls.save);
  ioGui.add(controls, "load").onChange(controls.load);
  const meshGui = gui.addFolder("mesh");
  meshGui.add(controls, "radius", 0, 40).onChange(controls.redraw);
  meshGui.add(controls, "tube", 0, 40).onChange(controls.redraw);
  meshGui
    .add(controls, "radialSegments", 0, 400)
    .step(1)
    .onChange(controls.redraw);
  meshGui
    .add(controls, "tubularSegments", 1, 20)
    .step(1)
    .onChange(controls.redraw);
  meshGui.add(controls, "p", 1, 10).step(1).onChange(controls.redraw);
  meshGui.add(controls, "q", 1, 15).step(1).onChange(controls.redraw);
  // meshGui.add(controls, 'scale', 0, 5).onChange(controls.redraw);

  // call the render function
  let step = 0;

  render();

  function createMesh(geom) {
    // assign two materials
    const meshMaterial = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      wireframe: true,
      wireframeLinewidth: 2,
      color: 0xaaaaaa,
    });
    meshMaterial.side = THREE.DoubleSide;

    // create a multimaterial
    const mesh = new THREE.Mesh(geom, meshMaterial);
    mesh.position.set(20, 0, 0);

    return mesh;
  }

  function render() {
    stats.update();

    step += 0.01;
    knot.rotation.y = step;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}
