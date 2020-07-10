function init() {
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  initDefaultLighting(scene);

  const flyControls = new THREE.FlyControls(camera);
  flyControls.movementSpeed = 25;
  flyControls.domElement = document.querySelector("webgl-output");
  flyControls.rollSpeed = Math.PI / 24;
  flyControls.autoForward = true;
  flyControls.dragToLook = false;

  const loader = new THREE.OBJLoader();
  loader.load("../../assets/models/city/city.obj", function (object) {
    const scale = chroma.scale(["red", "green", "blue"]);
    setRandomColors(object, scale);
    mesh = object;
    scene.add(mesh);
  });

  render();

  function render() {
    stats.update();
    flyControls.update(clock.getDelta());

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
