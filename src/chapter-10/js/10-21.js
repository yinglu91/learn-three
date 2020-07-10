function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and
  // lights. and add some simple default lights
  const scene = new THREE.Scene();
  const groundPlane = addLargeGroundPlane(scene);
  groundPlane.position.y = -10;

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const textureLoader = new THREE.TextureLoader();

  let cubeMesh;
  let sphereMesh;
  let polyhedronMesh;

  const controls = {
    repeatX: 1,
    repeatY: 1,
    repeatWrapping: true,

    updateRepeat: function (e) {
      cubeMesh.material.map.repeat.set(controls.repeatX, controls.repeatY);
      sphereMesh.material.map.repeat.set(controls.repeatX, controls.repeatY);
      polyhedronMesh.material.map.repeat.set(
        controls.repeatX,
        controls.repeatY
      );

      if (controls.repeatWrapping) {
        cubeMesh.material.map.wrapS = THREE.RepeatWrapping;
        cubeMesh.material.map.wrapT = THREE.RepeatWrapping;
        sphereMesh.material.map.wrapS = THREE.RepeatWrapping;
        sphereMesh.material.map.wrapT = THREE.RepeatWrapping;
        polyhedronMesh.material.map.wrapS = THREE.RepeatWrapping;
        polyhedronMesh.material.map.wrapT = THREE.RepeatWrapping;
      } else {
        cubeMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        cubeMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
        sphereMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        sphereMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
        polyhedronMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        polyhedronMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
      }

      cubeMesh.material.map.needsUpdate = true;
      sphereMesh.material.map.needsUpdate = true;
      polyhedronMesh.material.map.needsUpdate = true;
    },
  };

  const gui = new dat.GUI();

  const polyhedron = new THREE.IcosahedronGeometry(8, 0);
  polyhedronMesh = addGeometry(
    scene,
    polyhedron,
    "polyhedron",
    textureLoader.load("../../assets/textures/general/metal-rust.jpg"),
    gui,
    controls
  );
  polyhedronMesh.position.x = 20;

  const sphere = new THREE.SphereGeometry(5, 20, 20);
  sphereMesh = addGeometry(
    scene,
    sphere,
    "sphere",
    textureLoader.load("../../assets/textures/general/floor-wood.jpg"),
    gui,
    controls
  );

  const cube = new THREE.BoxGeometry(10, 10, 10);
  cubeMesh = addGeometry(
    scene,
    cube,
    "cube",
    textureLoader.load("../../assets/textures/general/brick-wall.jpg"),
    gui,
    controls
  );
  cubeMesh.position.x = -20;

  gui.add(controls, "repeatX", -4, 4).onChange(controls.updateRepeat);
  gui.add(controls, "repeatY", -4, 4).onChange(controls.updateRepeat);
  gui.add(controls, "repeatWrapping").onChange(controls.updateRepeat);

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
