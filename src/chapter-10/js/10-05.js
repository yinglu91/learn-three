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

  const ktxTextureLoader = new THREE.KTXLoader();
  let texture;

  switch (determineFormat()) {
    case "astc":
      texture = ktxTextureLoader.load(
        "../../assets/textures/ktx/disturb_ASTC4x4.ktx"
      );
      break;

    case "etc1":
      texture = ktxTextureLoader.load(
        "../../assets/textures/ktx/disturb_ETC1.ktx"
      );
      break;

    case "s3tc":
      texture = ktxTextureLoader.load(
        "../../assets/textures/ktx/disturb_BC1.ktx"
      );
      break;

    case "pvrtc":
      texture = ktxTextureLoader.load(
        "../../assets/textures/ktx/disturb_PVR2bpp.ktx"
      );
      break;
  }

  // add a simple plane to show the texture
  const knot = new THREE.TorusKnotGeometry(7, 3);
  const knotMesh = addGeometry(scene, knot, "plane", texture, gui, controls);
  knotMesh.material.side = THREE.DoubleSide;

  function determineFormat() {
    if (renderer.extensions.get("WEBGL_compressed_texture_astc") !== null)
      return "astc";
    if (renderer.extensions.get("WEBGL_compressed_texture_etc1") !== null)
      return "etc1";
    if (renderer.extensions.get("WEBGL_compressed_texture_s3tc") !== null)
      return "s3tc";
    if (renderer.extensions.get("WEBGL_compressed_texture_pvrtc") !== null)
      return "pvrtc";
  }

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    knotMesh.rotation.x += 0.01;
    knotMesh.rotation.y += 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
