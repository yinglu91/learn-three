function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  // create a scene and add a light
  const scene = new THREE.Scene();
  const earthAndLight = addEarth(scene);
  const earth = earthAndLight.earth;
  const pivot = earthAndLight.pivot;

  // setup effects
  const renderPass = new THREE.RenderPass(scene, camera);
  const customGrayScale = new THREE.ShaderPass(THREE.CustomGrayScaleShader);
  const customBit = new THREE.ShaderPass(THREE.CustomBitShader);
  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(customGrayScale);
  composer.addPass(customBit);
  composer.addPass(effectCopy);

  // setup controls
  const gui = new dat.GUI();
  addShaderControl(gui, "CustomGray", customGrayScale, {
    floats: [
      { key: "rPower", from: 0, to: 1, step: 0.01 },
      { key: "gPower", from: 0, to: 1, step: 0.01 },
      { key: "bPower", from: 0, to: 1, step: 0.01 },
    ],
  });
  addShaderControl(gui, "CustomBit", customBit, {
    floats: [{ key: "bitSize", from: 1, to: 16, step: 1 }],
  });

  // do the basic rendering
  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
