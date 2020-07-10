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

  initDefaultLighting(scene);

  const canvas = document.createElement("canvas");
  canvas.height = 256;
  canvas.height = 256;
  document.getElementById("canvas-output").appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const date = new Date();
  const pn = new Perlin("rnd" + date.getTime());

  fillWithPerlin(pn, ctx);
  function fillWithPerlin(perlin, ctx) {
    for (let x = 0; x < 300; x++) {
      for (let y = 0; y < 300; y++) {
        const base = new THREE.Color(0xffffff);
        const value = perlin.noise(x / 10, y / 10, 0);
        base.multiplyScalar(value);
        ctx.fillStyle = "#" + base.getHexString();
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const textureLoader = new THREE.TextureLoader();
  document.getElementById("canvas-output").appendChild(canvas);
  const cubeGeometry = new THREE.CubeGeometry(23, 10, 16);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    bumpMap: new THREE.Texture(canvas),
    metalness: 0,
    roughness: 1,
    color: 0xffffff,
    bumpScale: 3,
    map: textureLoader.load("../../assets/textures/general/wood-2.jpg"),
  });

  groundPlane.receiveShadow = true;
  const cute = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cute.castShadow = true;

  scene.add(cute);

  cute.material.bumpMap.needsUpdate = true;

  render();

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cute.rotation.y += 0.01;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
