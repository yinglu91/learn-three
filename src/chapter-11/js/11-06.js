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

  const amount = 50;
  const xRange = 20;
  const yRange = 20;
  const zRange = 20;

  const totalGroup = new THREE.Group();
  for (let i = 0; i < amount; i++) {
    const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    const boxMesh = new THREE.Mesh(boxGeometry, material);

    const rX = Math.random() * xRange - xRange / 2;
    const rY = Math.random() * yRange - yRange / 2;
    const rZ = Math.random() * zRange - zRange / 2;

    const totalRotation = 2 * Math.PI;

    boxMesh.position.set(rX, rY, rZ);
    boxMesh.rotation.set(
      Math.random() * totalRotation,
      Math.random() * totalRotation,
      Math.random() * totalRotation
    );
    totalGroup.add(boxMesh);
  }

  scene.add(totalGroup);

  const renderPass = new THREE.RenderPass(scene, camera);
  const aoPass = new THREE.SSAOPass(scene, camera);
  aoPass.renderToScreen = true;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(aoPass);

  addShaderControl(new dat.GUI(), "SSAO", aoPass, {
    setEnabled: false,
    floats: [
      { key: "radius", from: 1, to: 10, step: 0.1 },
      { key: "aoClamp", from: 0, to: 1, step: 0.01 },
      { key: "lumInfluence", from: 0, to: 2, step: 0.01 },
    ],
    booleans: [{ key: "onlyAO" }],
  });

  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    totalGroup.rotation.x += 0.0001;
    totalGroup.rotation.y += 0.001;

    requestAnimationFrame(render);

    composer.render(delta);
  }
}
