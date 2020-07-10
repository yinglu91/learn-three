function init() {
  Physijs.scripts.worker = "../../libs/other/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 50, 60));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const scene = new Physijs.Scene();
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x0393939));

  // setup controls
  const colors = [0x66ff00, 0x6600ff];
  const gui = new dat.GUI();
  const controls = {
    gravityX: 0,
    gravityY: -50,
    gravityZ: 0,
  };

  gui.add(controls, "gravityX", -100, 100, 1).onChange(function (e) {
    scene.setGravity(
      new THREE.Vector3(controls.gravityX, controls.gravityY, controls.gravityZ)
    );
  });
  gui.add(controls, "gravityY", -100, 100, 1).onChange(function (e) {
    scene.setGravity(
      new THREE.Vector3(controls.gravityX, controls.gravityY, controls.gravityZ)
    );
  });
  gui.add(controls, "gravityZ", -100, 100, 1).onChange(function (e) {
    scene.setGravity(
      new THREE.Vector3(controls.gravityX, controls.gravityY, controls.gravityZ)
    );
  });

  scene.setGravity(new THREE.Vector3(0, -50, 0));
  createGroundAndWalls(scene);
  const points = getPoints();
  const stones = [];

  points.forEach(function (point, index) {
    const stoneGeom = new THREE.BoxGeometry(0.6, 6, 2);
    const stone = new Physijs.BoxMesh(
      stoneGeom,
      Physijs.createMaterial(
        new THREE.MeshStandardMaterial({
          color: colors[index % colors.length],
          transparent: true,
          opacity: 0.8,
        })
      )
    );

    stone.position.copy(point);
    stone.lookAt(scene.position);

    stone.position.y = 3.5;
    stone.castShadow = true;
    stone.receiveShadow = true;

    stone.__dirtyRotation = true;
    scene.add(stone);
    stones.push(stone);
  });

  // set the initial rotiation of a stone so it'll fall down
  stones[0].rotation.x = 0.4;
  stones[0].__dirtyRotation = true;

  // do the basic rendering
  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    scene.simulate(undefined, 1);
  }
}

function getPoints() {
  const points = [];
  const r = 27;
  const cX = 0;
  const cY = 0;

  let circleOffset = 0;
  for (let i = 0; i < 1000; i += 6 + circleOffset) {
    circleOffset = 4.5 * (i / 360);

    const x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
    const z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
    const y = 0;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

function createGroundAndWalls(scene) {
  const textureLoader = new THREE.TextureLoader();
  const ground_material = Physijs.createMaterial(
    new THREE.MeshStandardMaterial({
      map: textureLoader.load("../../assets/textures/general/wood-2.jpg"),
    }),
    0.9,
    0.3
  );

  const ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(60, 1, 60),
    ground_material,
    0
  );
  ground.castShadow = true;
  ground.receiveShadow = true;

  const borderLeft = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 3, 60),
    ground_material,
    0
  );
  borderLeft.position.x = -31;
  borderLeft.position.y = 2;
  borderLeft.castShadow = true;
  borderLeft.receiveShadow = true;

  ground.add(borderLeft);

  const borderRight = new Physijs.BoxMesh(
    new THREE.BoxGeometry(2, 3, 60),
    ground_material,
    0
  );
  borderRight.position.x = 31;
  borderRight.position.y = 2;
  borderRight.castShadow = true;
  borderRight.receiveShadow = true;

  ground.add(borderRight);

  const borderBottom = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 3, 2),
    ground_material,
    0
  );
  borderBottom.position.z = 30;
  borderBottom.position.y = 2;
  borderBottom.castShadow = true;
  borderBottom.receiveShadow = true;

  ground.add(borderBottom);

  const borderTop = new Physijs.BoxMesh(
    new THREE.BoxGeometry(64, 3, 2),
    ground_material,
    0
  );
  borderTop.position.z = -30;
  borderTop.position.y = 2;
  borderTop.castShadow = true;
  borderTop.receiveShadow = true;

  ground.add(borderTop);

  scene.add(ground);
}
