function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render and configure it with shadows
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;

  // create a cube
  const cubeGeometry = new THREE.BoxBufferGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.set(-4, 2, 0);

  // add the cube to the scene

  const sphereGeometry = new THREE.SphereBufferGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.set(20, 4, 2);
  sphere.castShadow = true;

  // create the ground plane
  const planeGeometry = new THREE.PlaneBufferGeometry(60, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(15, 0, 0);
  plane.receiveShadow = true;

  // add the objects
  scene.add(cube);
  scene.add(sphere);
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;

  // If you want a more detailled shadow you can increase the
  // mapSize used to draw the shadows.
  // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(spotLight);

  const ambienLight = new THREE.AmbientLight(0x353535);
  scene.add(ambienLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  renderer.render(scene, camera);
}
