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
  scene.add(new THREE.AmbientLight(0x888888));

  const pointLight = new THREE.PointLight("#ffffff");
  scene.add(pointLight);
  const sphereLight = new THREE.SphereGeometry(0.2);
  const sphereLightMaterial = new THREE.MeshStandardMaterial({
    color: 0xff5808,
  });
  const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  scene.add(sphereLightMesh);

  const gui = new dat.GUI();
  const controls = {
    normalScaleX: 1,
    normalScaleY: 1,
  };

  const urls = [
    "../../assets/textures/cubemap/car/right.png",
    "../../assets/textures/cubemap/car/left.png",
    "../../assets/textures/cubemap/car/top.png",
    "../../assets/textures/cubemap/car/bottom.png",
    "../../assets/textures/cubemap/car/front.png",
    "../../assets/textures/cubemap/car/back.png",
  ];

  const cubeLoader = new THREE.CubeTextureLoader();
  scene.background = cubeLoader.load(urls);

  const sphere = new THREE.SphereGeometry(8, 50, 50);
  // const sphere = new THREE.CubeGeometry(12, 12, 12)
  const sphereMaterial = new THREE.MeshStandardMaterial({
    envMap: scene.background,
    // envMap: alternativeMap,
    color: 0xffffff,
    metalness: 1,
    roughness: 0.5,
  });

  const sphereMaterialWithMetalMap = sphereMaterial.clone();
  sphereMaterialWithMetalMap.metalnessMap = textureLoader.load(
    "../../assets/textures/engraved/roughness-map.jpg"
  );

  const sphereMaterialWithRoughnessMap = sphereMaterial.clone();
  sphereMaterialWithRoughnessMap.roughnessMap = textureLoader.load(
    "../../assets/textures/engraved/roughness-map.jpg"
  );

  const sphere1 = addGeometryWithMaterial(
    scene,
    sphere,
    "metal",
    gui,
    controls,
    sphereMaterialWithMetalMap
  );
  sphere1.position.x = -10;
  sphere1.rotation.y = (1 / 3) * Math.PI;

  const sphere2 = addGeometryWithMaterial(
    scene,
    sphere,
    "rough",
    gui,
    controls,
    sphereMaterialWithRoughnessMap
  );
  sphere2.position.x = 10;
  sphere2.rotation.y = (-1 / 3) * Math.PI;

  let invert = 1;
  let phase = 0;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (phase > 2 * Math.PI) {
      invert = invert * -1;
      phase -= 2 * Math.PI;
    } else {
      phase += 0.02;
    }

    sphereLightMesh.position.z = +(21 * Math.sin(phase));
    sphereLightMesh.position.x = -14 + 14 * Math.cos(phase);
    sphereLightMesh.position.y = 5;

    if (invert < 0) {
      const pivot = 0;
      sphereLightMesh.position.x =
        invert * (sphereLightMesh.position.x - pivot) + pivot;
    }
    pointLight.position.copy(sphereLightMesh.position);
  }
}
