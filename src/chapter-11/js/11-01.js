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

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectFilm);

  // setup controls
  const gui = new dat.GUI();
  const controls = {};
  addFilmPassControls(gui, controls, effectFilm);

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
