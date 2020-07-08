function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const scene = new THREE.Scene();
  const camera = initCamera(new THREE.Vector3(20, 40, 110));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  //  plane.receiveShadow  = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);

  // add the plane to the scene
  scene.add(plane);

  // create a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // cube.castShadow = true;

  // position the cube
  cube.position.set(-4, 3, 0);

  // add the cube to the scene
  scene.add(cube);

  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.set(20, 0, 2);
  //  sphere.castShadow=true;

  // add the sphere to the scene
  scene.add(sphere);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  // add subtle ambient lighting
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  const spotLight = new THREE.PointLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  //  spotLight.castShadow = true;
  scene.add(spotLight);

  const controls = new (function () {
    this.exportScene = function () {
      localStorage.setItem("scene", JSON.stringify(scene.toJSON()));
      console.log(localStorage.getItem("scene"));
    };

    this.clearScene = function () {
      scene = new THREE.Scene();
    };

    this.importScene = function () {
      const json = localStorage.getItem("scene");

      if (json) {
        const loadedSceneAsJson = JSON.parse(json);
        const loader = new THREE.ObjectLoader();
        scene = loader.parse(loadedSceneAsJson);
      }
    };
  })();

  const gui = new dat.GUI();
  gui.add(controls, "exportScene");
  gui.add(controls, "clearScene");
  gui.add(controls, "importScene");

  render();

  function render() {
    stats.update();
    // rotate the cube around its axes

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
