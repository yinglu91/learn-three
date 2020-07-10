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
  const controls = {
    displacementScale: 1,
    displacementBias: 0,
  };

  const sphere = new THREE.SphereGeometry(8, 180, 180);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load("../../assets/textures/w_c.jpg"),
    displacementMap: textureLoader.load("../../assets/textures/w_d.png"),
    metalness: 0.02,
    roughness: 0.07,
    color: 0xffffff,
  });

  groundPlane.receiveShadow = true;
  sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
  sphereMesh.castShadow = true;

  // addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);

  scene.add(sphereMesh);

  gui.add(controls, "displacementScale", -5, 5, 0.01).onChange(function (e) {
    sphereMaterial.displacementScale = e;
  });
  gui.add(controls, "displacementBias", -5, 5, 0.01).onChange(function (e) {
    sphereMaterial.displacementBias = e;
  });

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    sphereMesh.rotation.y += 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
