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
  initDefaultLighting(scene);

  const gui = new dat.GUI();
  const controls = {
    normalScaleX: 1,
    normalScaleY: 1,
  };

  const urls = [
    "../../assets/textures/cubemap/colloseum/right.png",
    "../../assets/textures/cubemap/colloseum/left.png",
    "../../assets/textures/cubemap/colloseum/top.png",
    "../../assets/textures/cubemap/colloseum/bottom.png",
    "../../assets/textures/cubemap/colloseum/front.png",
    "../../assets/textures/cubemap/colloseum/back.png",
  ];

  const cubeLoader = new THREE.CubeTextureLoader();
  const textureLoader = new THREE.TextureLoader();
  const cubeMap = cubeLoader.load(urls);
  scene.background = cubeMap;

  const cubeMaterial = new THREE.MeshStandardMaterial({
    envMap: cubeMap,
    color: 0xffffff,
    metalness: 1,
    roughness: 0,
  });

  const sphereMaterial = cubeMaterial.clone();
  sphereMaterial.normalMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg"
  );
  sphereMaterial.aoMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg"
  );
  sphereMaterial.shininessMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg"
  );

  const cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
  scene.add(cubeCamera);

  const cube = new THREE.CubeGeometry(26, 22, 12);
  const cube1 = addGeometryWithMaterial(
    scene,
    cube,
    "cube",
    gui,
    controls,
    cubeMaterial
  );
  cube1.position.x = -15;
  cube1.rotation.y = (-1 / 3) * Math.PI;
  cubeCamera.position.copy(cube1.position);
  cubeMaterial.envMap = cubeCamera.renderTarget;

  const sphere = new THREE.SphereGeometry(5, 50, 50);
  const sphere1 = addGeometryWithMaterial(
    scene,
    sphere,
    "sphere",
    gui,
    controls,
    sphereMaterial
  );
  sphere1.position.x = 15;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cube1.visible = false;
    cubeCamera.updateCubeMap(renderer, scene);
    cube1.visible = true;

    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
