function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  const scene = new THREE.Scene();
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const textureLoader = new THREE.TGALoader();
  const gui = new dat.GUI();
  const controls = {};

  const polyhedron = new THREE.IcosahedronGeometry(8, 0);
  const polyhedronMesh = addGeometry(
    scene,
    polyhedron,
    "polyhedron",
    textureLoader.load("../../assets/textures/tga/dried_grass.tga"),
    gui,
    controls
  );
  polyhedronMesh.position.x = 20;

  const sphere = new THREE.SphereGeometry(5, 20, 20);
  const sphereMesh = addGeometry(
    scene,
    sphere,
    "sphere",
    textureLoader.load("../../assets/textures/tga/grass.tga"),
    gui,
    controls
  );

  const cube = new THREE.BoxGeometry(10, 10, 10);
  const cubeMesh = addGeometry(
    scene,
    cube,
    "cube",
    textureLoader.load("../../assets/textures/tga/moss.tga"),
    gui,
    controls
  );
  cubeMesh.position.x = -20;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;
  }
}
