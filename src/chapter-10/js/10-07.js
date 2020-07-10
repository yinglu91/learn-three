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
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const gui = new dat.GUI();
  const controls = {};

  // images from: http://www.anyhere.com/gward/hdrenc/pages/originals.html
  const hdrTextureLoader = new THREE.RGBELoader();
  hdrTextureLoader.load(
    "../../assets/textures/hdr/dani_cathedral_oBBC.hdr",
    function (texture, metadata) {
      texture.encoding = THREE.RGBEEncoding;
      texture.flipY = true;

      // add a simple plane to show the texture
      const plane = new THREE.PlaneGeometry(20, 20);
      const planeMesh = addGeometry(
        scene,
        plane,
        "plane",
        texture,
        gui,
        controls
      );
      planeMesh.material.side = THREE.DoubleSide;

      // we add the webgl folder. When the tonemapping changes, we need
      // to update the material.
      addWebglFolder(gui, renderer, function () {
        planeMesh.material.needsUpdate = true;
      });
    }
  );

  /**
   * Adds the folder to the menu to control some tonemapping settings
   *
   * @param {*} gui
   * @param {*} renderer
   * @param {*} onToneMappingChange
   */
  function addWebglFolder(gui, renderer, onToneMappingChange) {
    const folder = gui.addFolder("WebGL Renderer");
    const controls = {
      toneMapping: renderer.toneMapping,
    };
    folder.add(renderer, "toneMappingExposure", 0, 2, 0.1);
    folder.add(renderer, "toneMappingWhitePoint", 0, 2, 0.1);
    folder
      .add(controls, "toneMapping", {
        NoToneMapping: THREE.NoToneMapping,
        LinearToneMapping: THREE.LinearToneMapping,
        ReinhardToneMapping: THREE.ReinhardToneMapping,
        Uncharted2ToneMapping: THREE.Uncharted2ToneMapping,
        Uncharted2ToneMapping: THREE.Uncharted2ToneMapping,
        CineonToneMapping: THREE.CineonToneMapping,
      })
      .onChange(function (tm) {
        renderer.toneMapping = parseInt(tm);
        onToneMappingChange();
      });
  }

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
