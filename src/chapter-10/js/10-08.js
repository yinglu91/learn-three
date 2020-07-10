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
  const textureLoader = new THREE.TextureLoader();
  const groundPlane = addLargeGroundPlane(scene, true);
  groundPlane.position.y = -8;

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const gui = new dat.GUI();
  const controls = {};

  const cube = new THREE.BoxGeometry(16, 16, 16);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load("../../assets/textures/stone/stone.jpg"),
    metalness: 0.2,
    roughness: 0.07,
  });

  const cubeMaterialWithBumpMap = cubeMaterial.clone();
  cubeMaterialWithBumpMap.bumpMap = textureLoader.load(
    "../../assets/textures/stone/stone-bump.jpg"
  );

  const cube1 = addGeometryWithMaterial(
    scene,
    cube,
    "cube-1",
    gui,
    controls,
    cubeMaterial
  );
  cube1.position.x = -17;
  cube1.rotation.y = (1 / 3) * Math.PI;

  const cube2 = addGeometryWithMaterial(
    scene,
    cube,
    "cube-2",
    gui,
    controls,
    cubeMaterialWithBumpMap
  );
  cube2.position.x = 17;
  cube2.rotation.y = (-1 / 3) * Math.PI;

  gui.add(cubeMaterialWithBumpMap, "bumpScale", -1, 1, 0.001);

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
