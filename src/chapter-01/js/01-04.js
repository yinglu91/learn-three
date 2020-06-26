function init() {
  const stats = initStats();

  // default setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // show axes in the screen
  const axes = new THREE.AxesHelper(20);
  scene.add(axes);

  // create the ground plane
  const planeGeometry = new THREE.PlaneBufferGeometry(60, 20, 1, 1);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);

  // add the plane to the scene
  scene.add(plane);

  // create a cube
  const cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.set(-4, 4, 0);

  // add the cube to the scene
  scene.add(cube);

  const sphereGeometry = new THREE.SphereBufferGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.set(20, 0, 2);
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  // add subtle ambient lighting
  const ambienLight = new THREE.AmbientLight(0x353535);
  scene.add(ambienLight);

  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-10, 20, -5);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  let step = 0;
  renderScene();

  function renderScene() {
    stats.update();

    // rotate the cube around its axes
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.02;

    // bounce the sphere up and down
    step += 0.04;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
}
