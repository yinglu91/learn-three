function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();
  renderer.autoClear = false;

  // create the scenes
  const sceneEarth = new THREE.Scene();
  const sceneMars = new THREE.Scene();
  const sceneBG = new THREE.Scene();

  // create all the scenes we'll be rendering.
  sceneBG.background = textureLoader.load(
    "../../assets/textures/bg/starry-deep-outer-space-galaxy.jpg"
  );
  const earthAndLight = addEarth(sceneEarth);
  sceneEarth.translateX(-16);
  sceneEarth.scale.set(1.2, 1.2, 1.2);
  const marsAndLight = addMars(sceneMars);
  sceneMars.translateX(12);
  sceneMars.translateY(6);
  sceneMars.scale.set(0.2, 0.2, 0.2);

  // setup passes. First the main renderpasses. Note that
  // only the bgRenderpass clears the screen.
  const bgRenderPass = new THREE.RenderPass(sceneBG, camera);
  const earthRenderPass = new THREE.RenderPass(sceneEarth, camera);
  earthRenderPass.clear = false;
  const marsRenderPass = new THREE.RenderPass(sceneMars, camera);
  marsRenderPass.clear = false;

  // setup the mask
  const clearMask = new THREE.ClearMaskPass();
  const earthMask = new THREE.MaskPass(sceneEarth, camera);
  const marsMask = new THREE.MaskPass(sceneMars, camera);

  // setup some effects to apply
  const effectSepia = new THREE.ShaderPass(THREE.SepiaShader);
  effectSepia.uniforms["amount"].value = 0.8;
  const effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
  effectColorify.uniforms["color"].value.setRGB(0.5, 0.5, 1);

  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  const composer = new THREE.EffectComposer(renderer);
  composer.renderTarget1.stencilBuffer = true;
  composer.renderTarget2.stencilBuffer = true;
  composer.addPass(bgRenderPass);
  composer.addPass(earthRenderPass);
  composer.addPass(marsRenderPass);
  composer.addPass(marsMask);
  composer.addPass(effectColorify);
  composer.addPass(clearMask);
  composer.addPass(earthMask);
  composer.addPass(effectSepia);
  composer.addPass(clearMask);
  composer.addPass(effectCopy);

  // setup controls
  const gui = new dat.GUI();
  const controls = {};
  addSepiaShaderControls(gui, controls, effectSepia);
  addColorifyShaderControls(gui, controls, effectColorify);

  // do the basic rendering
  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    earthAndLight.earth.rotation.y += 0.001;
    earthAndLight.pivot.rotation.y += -0.0003;
    marsAndLight.mars.rotation.y += -0.001;
    marsAndLight.pivot.rotation.y += +0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
