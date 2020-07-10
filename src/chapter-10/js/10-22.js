function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  // initialize canvas drawing
  const canvas = document.createElement("canvas");
  document.getElementById("canvas-output").appendChild(canvas);
  $("#canvas-output").literallycanvas({
    imageURLPrefix: "../../libs/other/literally/img",
  });

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  const scene = new THREE.Scene();
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const texture = new THREE.Texture(canvas);
  const gui = new dat.GUI();
  const controls = {};

  const polyhedron = new THREE.IcosahedronGeometry(8, 0);
  const polyhedronMesh = addGeometry(
    scene,
    polyhedron,
    "polyhedron",
    texture,
    gui,
    controls
  );
  polyhedronMesh.position.x = 20;

  const sphere = new THREE.SphereGeometry(5, 20, 20);
  const sphereMesh = addGeometry(
    scene,
    sphere,
    "sphere",
    texture,
    gui,
    controls
  );

  const cube = new THREE.BoxGeometry(10, 10, 10);
  const cubeMesh = addGeometry(scene, cube, "cube", texture, gui, controls);
  cubeMesh.position.x = -20;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.x += 0.01;
    cubeMesh.rotation.x += 0.01;
    polyhedronMesh.material.map.needsUpdate = true;
    sphereMesh.material.map.needsUpdate = true;
    cubeMesh.material.map.needsUpdate = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
