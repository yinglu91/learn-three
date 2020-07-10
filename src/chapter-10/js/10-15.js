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
  const spotLight = scene.getObjectByName("spotLight");
  spotLight.intensity = 0.1;
  scene.remove(scene.getObjectByName("ambientLight"));

  const gui = new dat.GUI();
  const controls = {
    lightIntensity: 0.1,
  };

  const cubeMaterial = new THREE.MeshStandardMaterial({
    emissive: 0xffffff,
    emissiveMap: textureLoader.load("../../assets/textures/emissive/lava.png"),
    normalMap: textureLoader.load(
      "../../assets/textures/emissive/lava-normals.png"
    ),
    metalnessMap: textureLoader.load(
      "../../assets/textures/emissive/lava-smoothness.png"
    ),
    metalness: 1,
    roughness: 0.4,
    normalScale: new THREE.Vector2(4, 4),
  });

  const cube = new THREE.BoxGeometry(16, 16, 16);
  const cube1 = addGeometryWithMaterial(
    scene,
    cube,
    "cube",
    gui,
    controls,
    cubeMaterial
  );
  cube1.rotation.y = (1 / 3) * Math.PI;
  cube1.position.x = -12;

  const sphere = new THREE.SphereGeometry(9, 50, 50);
  const sphere1 = addGeometryWithMaterial(
    scene,
    sphere,
    "sphere",
    gui,
    controls,
    cubeMaterial.clone()
  );
  sphere1.rotation.y = (1 / 6) * Math.PI;
  sphere1.position.x = 15;

  gui.add(controls, "lightIntensity", 0, 1, 0.01).onChange(function (e) {
    spotLight.intensity = e;
  });

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
