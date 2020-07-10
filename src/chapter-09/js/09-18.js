function init() {
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));

  camera.position.set(0, 10, 70);
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  let mixer = new THREE.AnimationMixer();
  const sceneContainer = new THREE.Scene();
  let clipAction;
  let animationClip;
  let controls;
  const mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function () {
      mixer.stopAllAction();
    },
  };

  initDefaultLighting(scene);

  const loader = new THREE.SEA3D({
    container: sceneContainer,
  });
  loader.load("../../assets/models/mascot/mascot.sea");
  loader.onComplete = function (e) {
    const skinnedMesh = sceneContainer.children[0];
    skinnedMesh.scale.set(0.1, 0.1, 0.1);
    skinnedMesh.translateX(-40);
    skinnedMesh.translateY(-20);
    skinnedMesh.rotateY(-0.2 * Math.PI);
    scene.add(skinnedMesh);

    // and set up the animation
    mixer = new THREE.AnimationMixer(skinnedMesh);
    animationClip = skinnedMesh.animations[0].clip;
    clipAction = mixer.clipAction(animationClip).play();
    animationClip = clipAction.getClip();
    enableControls();
  };

  function enableControls() {
    const gui = new dat.GUI();
    const mixerFolder = gui.addFolder("AnimationMixer");
    mixerFolder.add(mixerControls, "time").listen();
    mixerFolder
      .add(mixerControls, "timeScale", 0, 5)
      .onChange(function (timeScale) {
        mixer.timeScale = timeScale;
      });
    mixerFolder.add(mixerControls, "stopAllAction").listen();

    controls = addClipActionFolder(
      "ClipAction 1",
      gui,
      clipAction,
      animationClip
    );
  }

  render();

  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (mixer && clipAction && controls) {
      mixer.update(delta);
      controls.time = mixer.time;
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }
}
