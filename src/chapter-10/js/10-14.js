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

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const groundPlane = addLargeGroundPlane(scene, true);
  groundPlane.position.y = -8;

  const gui = new dat.GUI();
  const controls = {};

  const alternativeMap = textureLoader.load(
    "../../assets/textures/alpha/partial-transparency.png"
  ); //?? missing TODO book?

  const sphere = new THREE.SphereGeometry(8, 180, 180);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    alphaMap: textureLoader.load(
      "../../assets/textures/alpha/partial-transparency.png"
    ),
    envMap: alternativeMap,
    metalness: 0.02,
    roughness: 0.07,
    color: 0xffffff,
    alphaTest: 0.5,
  });

  sphereMaterial.alphaMap.wrapS = THREE.RepeatWrapping;
  sphereMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
  sphereMaterial.alphaMap.repeat.set(8, 8);

  const mesh = addGeometryWithMaterial(
    scene,
    sphere,
    "sphere",
    gui,
    controls,
    sphereMaterial
  );
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
