function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();

  // create a scene and add a light
  const scene = new THREE.Scene();
  const earthAndLight = addEarth(scene);
  const earth = earthAndLight.earth;
  const pivot = earthAndLight.pivot;

  // setup effects
  const renderPass = new THREE.RenderPass(scene, camera);
  const glitchPass = new THREE.GlitchPass();
  const halftonePass = new THREE.HalftonePass();
  const outlinePass = new THREE.OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
    [earth]
  );
  const unrealBloomPass = new THREE.UnrealBloomPass();

  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  // define the composers
  const composer1 = new THREE.EffectComposer(renderer);
  composer1.addPass(renderPass);
  composer1.addPass(glitchPass);
  composer1.addPass(effectCopy);

  const composer2 = new THREE.EffectComposer(renderer);
  composer2.addPass(renderPass);
  composer2.addPass(halftonePass);
  composer2.addPass(effectCopy);

  const composer3 = new THREE.EffectComposer(renderer);
  composer3.addPass(renderPass);
  composer3.addPass(outlinePass);
  composer3.addPass(effectCopy);

  const composer4 = new THREE.EffectComposer(renderer);
  composer4.addPass(renderPass);
  composer4.addPass(unrealBloomPass);
  composer4.addPass(effectCopy);

  // setup controls
  // setup controls
  const gui = new dat.GUI();
  const controls = {};

  addGlitchPassControls(gui, controls, glitchPass, function (gp) {
    composer1.passes[1] = gp;
  });
  addHalftonePassControls(gui, controls, halftonePass, function (htp) {
    composer2 = new THREE.EffectComposer(renderer);
    composer2.addPass(renderPass);
    composer2.addPass(htp);
    composer2.addPass(effectCopy);
  });
  addOutlinePassControls(gui, controls, outlinePass);
  addUnrealBloomPassControls(gui, controls, unrealBloomPass, function (ub) {
    composer4 = new THREE.EffectComposer(renderer);
    composer4.addPass(renderPass);
    composer4.addPass(ub);
    composer4.addPass(effectCopy);
  });

  // do the rendering to different parts
  const width = window.innerWidth;
  const height = window.innerHeight;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  render();

  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    renderer.autoClear = false;
    renderer.clear();

    renderer.setViewport(0, 0, halfWidth, halfHeight);
    composer1.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    composer2.render(delta);

    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    composer3.render(delta);

    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer4.render(delta);

    requestAnimationFrame(render);
  }
}
