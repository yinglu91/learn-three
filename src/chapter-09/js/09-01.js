function init() {
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const scene = new THREE.Scene();

  initDefaultLighting(scene);

  const groundPlane = addGroundPlane(scene);
  groundPlane.position.y = 0;

  // create a cube
  const cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.set(-10, 4, 0);

  // add the cube to the scene
  scene.add(cube);

  const sphereGeometry = new THREE.SphereBufferGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.set(20, 0, 2);
  sphere.castShadow = true;
  // add the sphere to the scene
  scene.add(sphere);

  const cylinderGeometry = new THREE.CylinderBufferGeometry(2, 2, 20);
  const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x77ff77 });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.castShadow = true;
  cylinder.position.set(0, 0, 1);

  scene.add(cylinder);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  // add subtle ambient lighting
  const ambienLight = new THREE.AmbientLight(0x353535);
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // show axes in the screen
  const axes = new THREE.AxesHelper(20);
  scene.add(axes);

  // call the render function
  let step = 0;
  let scalingStep = 0;

  const controls = new (function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
    this.scalingSpeed = 0.03;
  })();

  const gui = new dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 0.5);
  gui.add(controls, "bouncingSpeed", 0, 0.5);
  gui.add(controls, "scalingSpeed", 0, 0.5);

  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();

  renderScene();

  function renderScene() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + 10 * Math.cos(step);
    sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

    // scale the cylinder
    scalingStep += controls.scalingSpeed;
    const scaleX = Math.abs(Math.sin(scalingStep / 4));
    const scaleY = Math.abs(Math.cos(scalingStep / 5));
    const scaleZ = Math.abs(Math.sin(scalingStep / 7));
    cylinder.scale.set(scaleX, scaleY, scaleZ);

    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);

    renderer.render(scene, camera);
  }
}
