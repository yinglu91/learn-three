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
  const effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
  effectFilm.renderToScreen = true;

  const bloomPass = new THREE.BloomPass();
  const dotScreenPass = new THREE.DotScreenPass();
  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectCopy);

  // reuse the rendered scene from the composer
  const renderedScene = new THREE.TexturePass(composer.renderTarget2);

  // define the composers
  const effectFilmComposer = new THREE.EffectComposer(renderer);
  effectFilmComposer.addPass(renderedScene);
  effectFilmComposer.addPass(effectFilm);

  const bloomComposer = new THREE.EffectComposer(renderer);
  bloomComposer.addPass(renderedScene);
  bloomComposer.addPass(bloomPass);
  bloomComposer.addPass(effectCopy);

  const dotScreenComposer = new THREE.EffectComposer(renderer);
  dotScreenComposer.addPass(renderedScene);
  dotScreenComposer.addPass(dotScreenPass);
  dotScreenComposer.addPass(effectCopy);

  // setup controls
  const gui = new dat.GUI();
  const controls = {};

  addFilmPassControls(gui, controls, effectFilm);
  addDotScreenPassControls(gui, controls, dotScreenPass);
  addBloomPassControls(gui, controls, bloomPass, function (updated) {
    bloomComposer.passes[1] = updated;
  });

  // do the basic rendering, since we render to multiple parts of the screen
  // determine the
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
    effectFilmComposer.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    bloomComposer.render(delta);

    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    dotScreenComposer.render(delta);

    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer.render(delta);

    requestAnimationFrame(render);
  }
}
