function init() {
  // for the bokeh effect

  // 1. add a cubemap
  // 2. render a torusknot in the middle.
  // 3. render a sphere to the right and the left halfway
  // 4. render a wall of cubes at a distance

  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  camera.far = 300;
  camera.updateProjectionMatrix();
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  const scene = new THREE.Scene();
  initDefaultLighting(scene);
  const groundPlane = addLargeGroundPlane(scene, true);
  groundPlane.position.y = -8;

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
  const sphereMaterial = new THREE.MeshStandardMaterial({
    envMap: cubeLoader.load(urls),
    color: 0xffffff,
    metalness: 1,
    roughness: 0.3,
  });

  sphereMaterial.normalMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg"
  );
  sphereMaterial.aoMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg"
  );
  sphereMaterial.shininessMap = textureLoader.load(
    "../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg"
  );

  const sphereGeometry = new THREE.SphereGeometry(5, 50, 50);
  const sphere = addGeometryWithMaterial(
    scene,
    sphereGeometry,
    "sphere",
    gui,
    controls,
    sphereMaterial
  );
  sphere.position.x = 0;

  const boxMaterial1 = new THREE.MeshStandardMaterial({ color: 0x0066ff });
  const m1 = new THREE.BoxGeometry(10, 10, 10);
  const m1m = addGeometryWithMaterial(
    scene,
    m1,
    "m1",
    gui,
    controls,
    boxMaterial1
  );
  m1m.position.z = -40;
  m1m.position.x = -35;
  m1m.rotation.y = 1;

  const m2 = new THREE.BoxGeometry(10, 10, 10);
  const boxMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff6600 });
  const m2m = addGeometryWithMaterial(
    scene,
    m2,
    "m2",
    gui,
    controls,
    boxMaterial2
  );
  m2m.position.z = -40;
  m2m.position.x = 35;
  m2m.rotation.y = -1;

  const totalWidth = 220;
  const nBoxes = 10;
  for (let i = 0; i < nBoxes; i++) {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const mat = new THREE.MeshStandardMaterial({ color: 0x66ff00 });
    const mesh = new THREE.Mesh(box, mat);
    mesh.position.z = -120;
    mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i;
    mesh.rotation.y = i;
    scene.add(mesh);
  }

  const params = {
    focus: 10,
    aspect: camera.aspect,
    aperture: 0.0002,
    maxblur: 1,
  };

  const renderPass = new THREE.RenderPass(scene, camera);
  const bokehPass = new THREE.BokehPass(scene, camera, params);
  bokehPass.renderToScreen = true;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bokehPass);

  addShaderControl(
    gui,
    "Bokeh",
    bokehPass.materialBokeh,
    {
      floats: [
        { key: "focus", from: 10, to: 200, step: 0.01 },
        { key: "aperture", from: 0, to: 0.0005, step: 0.000001 },
        { key: "maxblur", from: 0, to: 1, step: 0.1 },
      ],
    },
    false
  );

  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    sphere.rotation.y -= 0.01;

    requestAnimationFrame(render);
    composer.render(delta);
  }
}
