function init() {
  Physijs.scripts.worker = "../../libs/other/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(10, 10, 10));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  scene = new Physijs.Scene({ reportSize: 10, fixedTimeStep: 1 / 60 });
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  initDefaultLighting(scene);

  createGroundAndWalls(scene);
  const car = createCar(scene);
  scene.simulate();

  const controls = new (function () {
    this.velocity = -2;
    this.wheelAngle = 0.5;

    this.loosenXRight = 0.0001;
    this.loosenXLeft = 0.0001;

    this.changeVelocity = function () {
      // if you add a motor, the current constraint is overridden if you want to rotate set min higher then max
      car.flConstraint.configureAngularMotor(
        2,
        0.1,
        0,
        controls.velocity,
        15000
      );
      car.frConstraint.configureAngularMotor(
        2,
        0.1,
        0,
        controls.velocity,
        15000
      );

      // motor two is forward and backwards
      car.flConstraint.enableAngularMotor(2);
      car.frConstraint.enableAngularMotor(2);
    };

    this.changeOrientation = function () {
      car.rrConstraint.setAngularLowerLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 0.1,
      });
      car.rrConstraint.setAngularUpperLimit({
        x: controls.loosenXRight,
        y: controls.wheelAngle,
        z: 0,
      });
      car.rlConstraint.setAngularLowerLimit({
        x: controls.loosenXLeft,
        y: controls.wheelAngle,
        z: 0.1,
      });
      car.rlConstraint.setAngularUpperLimit({
        x: 0,
        y: controls.wheelAngle,
        z: 0,
      });
    };
  })();

  const gui = new dat.GUI();
  gui.add(controls, "velocity", -10, 10).onChange(controls.changeVelocity);
  gui.add(controls, "wheelAngle", -1, 1).onChange(controls.changeOrientation);
  gui
    .add(controls, "loosenXRight", 0, 0.5)
    .step(0.01)
    .onChange(controls.changeOrientation);
  gui
    .add(controls, "loosenXLeft", 0, 0.6)
    .step(-0.01)
    .onChange(controls.changeOrientation);
  controls.loosenXLeft = 0;
  controls.loosenXRight = 0;

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

function createCar(scene) {
  const car = {};
  const car_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      color: 0xff4444,
      opacity: 0.9,
      transparent: true,
    }),
    0.5, // high friction
    0.5 // medium restitution
  );

  // create the car body
  const geom = new THREE.BoxGeometry(15, 4, 4);
  const body = new Physijs.BoxMesh(geom, car_material, 500);
  body.position.set(5, 5, 5);
  body.castShadow = true;
  scene.add(body);

  // create the wheels
  const fr = createWheel(new THREE.Vector3(0, 4, 10));
  const fl = createWheel(new THREE.Vector3(0, 4, 0));
  const rr = createWheel(new THREE.Vector3(10, 4, 10));
  const rl = createWheel(new THREE.Vector3(10, 4, 0));

  // add the wheels to the scene
  scene.add(fr);
  scene.add(fl);
  scene.add(rr);
  scene.add(rl);

  const frConstraint = createWheelConstraint(
    fr,
    body,
    new THREE.Vector3(0, 4, 8)
  );
  scene.addConstraint(frConstraint);

  const flConstraint = createWheelConstraint(
    fl,
    body,
    new THREE.Vector3(0, 4, 2)
  );
  scene.addConstraint(flConstraint);

  const rrConstraint = createWheelConstraint(
    rr,
    body,
    new THREE.Vector3(10, 4, 8)
  );
  scene.addConstraint(rrConstraint);

  const rlConstraint = createWheelConstraint(
    rl,
    body,
    new THREE.Vector3(10, 4, 2)
  );
  scene.addConstraint(rlConstraint);

  // backwheels don't move themselves and are restriced in their
  // movement. They should be able to rotate along the z-axis
  // same here, if the complete angle is allowed set lower higher
  // than upper.
  // by setting the lower and upper to the same value you can
  // fix the position
  // we can set the x position to 'loosen' the axis for the directional
  rrConstraint.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
  rrConstraint.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });
  rlConstraint.setAngularLowerLimit({ x: 0, y: 0.5, z: 0.1 });
  rlConstraint.setAngularUpperLimit({ x: 0, y: 0.5, z: 0 });

  // front wheels should only move along the z axis.
  // we don't need to specify anything here, since
  // that value is overridden by the motors
  frConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
  frConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });
  flConstraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
  flConstraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

  // if you add a motor, the current constraint is overridden
  // if you want to rotate set min higher then max
  flConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);
  frConstraint.configureAngularMotor(2, 0.1, 0, -2, 1500);

  // motor one is for left and right
  //                frConstraint.enableAngularMotor(1);

  // motor two is forward and backwards
  flConstraint.enableAngularMotor(2);
  frConstraint.enableAngularMotor(2);

  car.flConstraint = flConstraint;
  car.frConstraint = frConstraint;
  car.rlConstraint = rlConstraint;
  car.rrConstraint = rrConstraint;

  return car;
}

function createWheelConstraint(wheel, body, position) {
  const constraint = new Physijs.DOFConstraint(wheel, body, position);

  return constraint;
}

function createWheel(position) {
  const wheel_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      color: 0x444444,
      opacity: 0.9,
      transparent: true,
    }),
    1.0, // high friction
    0.5 // medium restitution
  );

  const wheel_geometry = new THREE.CylinderGeometry(4, 4, 2, 10);
  const wheel = new Physijs.CylinderMesh(wheel_geometry, wheel_material, 100);

  wheel.rotation.x = Math.PI / 2;
  wheel.castShadow = true;
  wheel.position.copy(position);
  return wheel;
}

function createGroundAndWalls(scene) {
  const ground_material = Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: THREE.ImageUtils.loadTexture(
        "../../assets/textures/general/floor-wood.jpg"
      ),
    }),
    0.9,
    0.7
  );
  const ground = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 1, 80),
    ground_material,
    0
  );
  scene.add(ground);
  const wall_material = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1 }),
    0.9,
    0.7
  );
  const wall1 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(1, 100, 80),
    wall_material,
    0
  );
  wall1.position.x = -25;
  wall1.position.y = 50;
  scene.add(wall1);
  const wall2 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(1, 100, 80),
    wall_material,
    0
  );
  wall2.position.x = 25;
  wall2.position.y = 50;
  scene.add(wall2);
  const wall3 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 100, 1),
    wall_material,
    0
  );
  wall3.position.y = 50;
  wall3.position.z = -40;
  scene.add(wall3);
  const wall4 = new Physijs.BoxMesh(
    new THREE.BoxGeometry(50, 100, 1),
    wall_material,
    0
  );
  wall4.position.y = 50;
  wall4.position.z = 40;
  scene.add(wall4);
}
