function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const clock = new THREE.Clock();
  const trackballControls = initTrackballControls(camera, renderer);

  camera.position.set(0, 0, 150);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  createPoints();
  render();

  function createPoints() {
    const geom = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      color: 0xffffff,
    });

    for (let x = -15; x < 15; x++) {
      for (let y = -10; y < 10; y++) {
        const particle = new THREE.Vector3(x * 4, y * 4, 0);
        geom.vertices.push(particle);
        geom.colors.push(new THREE.Color(Math.random() * 0xffffff));
      }
    }

    const cloud = new THREE.Points(geom, material);
    scene.add(cloud);
  }

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
