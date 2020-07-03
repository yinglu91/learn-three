function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const group = new THREE.Mesh();

  // add all the rubik cube elements
  const mats = [0x009e60, 0x0051ba, 0xffd500, 0xff5800, 0xc41e3a, 0xffffff].map(
    (color) =>
      new THREE.MeshBasicMaterial({
        color,
      })
  );

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
        const cube = new THREE.Mesh(cubeGeom, mats);
        cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);

        group.add(cube);
      }
    }
  }

  group.scale.copy(new THREE.Vector3(2, 2, 2));
  // call the render function
  scene.add(group);

  let step = 0;

  const controls = new (function () {
    this.rotationSpeed = 0.01;
    this.numberOfObjects = scene.children.length;
  })();

  const gui = new dat.GUI();
  gui.add(controls, 'rotationSpeed', 0, 0.5);

  render();

  debugger;

  function render() {
    stats.update();

    group.rotation.y = step += controls.rotationSpeed;
    group.rotation.z = step -= controls.rotationSpeed;
    group.rotation.x = step += controls.rotationSpeed;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
