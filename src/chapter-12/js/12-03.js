function init() {
  Physijs.scripts.worker = "../../libs/other/physijs/physijs_worker.js";
  Physijs.scripts.ammo = "./ammo.js";

  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(50, 120, 220));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const scene = new Physijs.Scene();
  initDefaultLighting(scene, new THREE.Vector3(0, 50, 120));
  scene.add(new THREE.AmbientLight(0x0393939));

  const meshes = [];
  const controls = {
    addSphereMesh: function () {
      const sphere = new Physijs.SphereMesh(
        new THREE.SphereGeometry(3, 20),
        getMaterial()
      );
      setPosAndShade(sphere);
      meshes.push(sphere);
      scene.add(sphere);
    },
    addBoxMesh: function () {
      const cube = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 2, 6),
        getMaterial()
      );
      setPosAndShade(cube);
      meshes.push(cube);
      scene.add(cube);
    },
    addCylinderMesh: function () {
      const cylinder = new Physijs.CylinderMesh(
        new THREE.CylinderGeometry(2, 2, 6),
        getMaterial()
      );
      setPosAndShade(cylinder);
      meshes.push(cylinder);
      scene.add(cylinder);
    },
    addConeMesh: function () {
      const cone = new Physijs.ConeMesh(
        new THREE.CylinderGeometry(0, 3, 7, 20, 10),
        getMaterial()
      );
      setPosAndShade(cone);
      meshes.push(cone);
      scene.add(cone);
    },
    addPlaneMesh: function () {
      const plane = new Physijs.PlaneMesh(
        new THREE.PlaneGeometry(5, 5, 10, 10),
        getMaterial()
      );
      setPosAndShade(plane);
      meshes.push(plane);
      scene.add(plane);
    },
    addCapsuleMesh: function () {
      const merged = new THREE.Geometry();
      const cyl = new THREE.CylinderGeometry(2, 2, 6);
      const top = new THREE.SphereGeometry(2);
      const bot = new THREE.SphereGeometry(2);

      let matrix = new THREE.Matrix4();
      matrix.makeTranslation(0, 3, 0);
      top.applyMatrix(matrix);

      matrix = new THREE.Matrix4();
      matrix.makeTranslation(0, -3, 0);
      bot.applyMatrix(matrix);

      // merge to create a capsule
      merged.merge(top);
      merged.merge(bot);
      merged.merge(cyl);

      // create a physijs capsule mesh
      const capsule = new Physijs.CapsuleMesh(merged, getMaterial());
      setPosAndShade(capsule);

      meshes.push(capsule);
      scene.add(capsule);
    },
    addConvexMesh: function () {
      const convex = new Physijs.ConvexMesh(
        new THREE.TorusKnotGeometry(3.5, 2.3, 64, 8, 2, 3, 10),
        getMaterial()
      );
      setPosAndShade(convex);
      meshes.push(convex);
      scene.add(convex);
    },
    clearMeshes: function () {
      meshes.forEach(function (e) {
        scene.remove(e);
      });
      meshes = [];
    },
  };

  const gui = new dat.GUI();
  gui.add(controls, "addPlaneMesh");
  gui.add(controls, "addBoxMesh");
  gui.add(controls, "addSphereMesh");
  gui.add(controls, "addCylinderMesh");
  gui.add(controls, "addConeMesh");
  gui.add(controls, "addCapsuleMesh");
  gui.add(controls, "addConvexMesh");
  gui.add(controls, "clearMeshes");

  // setup the heightmap
  const date = new Date();
  const pn = new Perlin("rnd" + date.getTime());
  const map = createHeightMap(pn);
  scene.add(map);

  scene.simulate();
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

function getMaterial() {
  const scale = chroma.scale(["blue", "white", "red", "yellow"]);
  return Physijs.createMaterial(
    new THREE.MeshPhongMaterial({ color: scale(Math.random()).hex() }),
    0.5,
    0.7
  );
}

function createHeightMap(pn) {
  const ground_material = Physijs.createMaterial(
    new THREE.MeshStandardMaterial({
      map: THREE.ImageUtils.loadTexture(
        "../../assets/textures/ground/grasslight-big.jpg"
      ),
    }),
    0.3,
    0.8
  );
  const ground_geometry = new THREE.PlaneGeometry(220, 200, 100, 100);
  for (let i = 0; i < ground_geometry.vertices.length; i++) {
    const vertex = ground_geometry.vertices[i];
    const value = pn.noise(vertex.x / 12, vertex.y / 12, 0);
    vertex.z = value * 13;
  }
  ground_geometry.computeFaceNormals();
  ground_geometry.computeVertexNormals();

  const ground = new Physijs.HeightfieldMesh(
    ground_geometry,
    ground_material,
    0,
    100,
    100
  );
  ground.rotation.x = Math.PI / -2;
  ground.rotation.y = 0.5;
  ground.receiveShadow = true;

  return ground;
}

function setPosAndShade(obj) {
  obj.position.set(Math.random() * 20 - 45, 40, Math.random() * 20 - 5);
  obj.rotation.set(
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI,
    Math.random() * 2 * Math.PI
  );
  obj.castShadow = true;
}
