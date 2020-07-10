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
  const textureLoader = new THREE.TextureLoader();

  const urls = [
    "../../assets/textures/cubemap/flowers/right.png",
    "../../assets/textures/cubemap/flowers/left.png",
    "../../assets/textures/cubemap/flowers/top.png",
    "../../assets/textures/cubemap/flowers/bottom.png",
    "../../assets/textures/cubemap/flowers/front.png",
    "../../assets/textures/cubemap/flowers/back.png",
  ];

  const cubeLoader = new THREE.CubeTextureLoader();
  scene.background = cubeLoader.load(urls);

  const cubeMaterial = new THREE.MeshStandardMaterial({
    envMap: scene.background,
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

  const cubeGeometry = new THREE.CubeGeometry(16, 12, 12);
  const cube = addGeometryWithMaterial(
    scene,
    cubeGeometry,
    "cube",
    gui,
    controls,
    cubeMaterial
  );
  cube.position.x = -15;
  cube.rotation.y = (-1 / 3) * Math.PI;

  const sphereGeometry = new THREE.SphereGeometry(10, 50, 50);
  const sphere = addGeometryWithMaterial(
    scene,
    sphereGeometry,
    "sphere",
    gui,
    controls,
    sphereMaterial
  );
  sphere.position.x = 15;

  gui.add({ refraction: false }, "refraction").onChange(function (e) {
    if (e) {
      scene.background.mapping = THREE.CubeRefractionMapping;
    } else {
      scene.background.mapping = THREE.CubeReflectionMapping;
    }

    cube.material.needsUpdate = true;
    sphere.material.needsUpdate = true;
  });

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cube.rotation.y += 0.01;
    sphere.rotation.y -= 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
