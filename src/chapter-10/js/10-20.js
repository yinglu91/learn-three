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
  const groundPlane = addLargeGroundPlane(scene, true);
  groundPlane.position.y = -8;
  groundPlane.receiveShadow = true;

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load("../../assets/textures/uv/ash_uvgrid01.jpg"),
    metalness: 0.02,
    roughness: 0.07,
    color: 0xffffff,
  });

  const geom = new THREE.BoxGeometry(14, 14, 14);
  geom.faceVertexUvs[0][0][0].x = 0.5;
  geom.faceVertexUvs[0][0][0].y = 0.7;
  geom.faceVertexUvs[0][0][1].x = 0.4;
  geom.faceVertexUvs[0][0][1].y = 0.1;
  geom.faceVertexUvs[0][0][2].x = 0.4;
  geom.faceVertexUvs[0][0][2].y = 0.5;

  const mesh = new THREE.Mesh(geom, material);
  mesh.rotation.y = 1.7 * Math.PI;
  scene.add(mesh);

  const controls = new (function () {
    // we need the first child, since it's a multimaterial
    this.uv1 = geom.faceVertexUvs[0][0][0].x;
    this.uv2 = geom.faceVertexUvs[0][0][0].y;
    this.uv3 = geom.faceVertexUvs[0][0][1].x;
    this.uv4 = geom.faceVertexUvs[0][0][1].y;
    this.uv5 = geom.faceVertexUvs[0][0][2].x;
    this.uv6 = geom.faceVertexUvs[0][0][2].y;
  })();

  const gui = new dat.GUI();
  gui.add(controls, "uv1", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][0].x = e;
    geom.uvsNeedUpdate = true;
  });
  gui.add(controls, "uv2", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][0].y = e;
    geom.uvsNeedUpdate = true;
  });
  gui.add(controls, "uv3", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][1].x = e;
    geom.uvsNeedUpdate = true;
  });
  gui.add(controls, "uv4", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][1].y = e;
    geom.uvsNeedUpdate = true;
  });
  gui.add(controls, "uv5", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][2].x = e;
    geom.uvsNeedUpdate = true;
  });
  gui.add(controls, "uv6", 0, 1).onChange(function (e) {
    geom.faceVertexUvs[0][0][2].y = e;
    geom.uvsNeedUpdate = true;
  });

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
