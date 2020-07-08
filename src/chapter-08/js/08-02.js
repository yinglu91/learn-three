function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const scene = new THREE.Scene();
  const camera = initCamera(new THREE.Vector3(0, 40, 50));

  camera.lookAt(scene.position);

  const cubeMaterial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
  });

  const controls = new (function () {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.rotationSpeed = 0.02;
    this.combined = false;

    this.numberOfObjects = 500;

    this.redraw = function () {
      const toRemove = [];
      scene.traverse(function (e) {
        if (e instanceof THREE.Mesh) toRemove.push(e);
      });
      toRemove.forEach(function (e) {
        scene.remove(e);
      });

      // add a large number of cubes
      if (controls.combined) {
        const geometry = new THREE.Geometry();
        for (let i = 0; i < controls.numberOfObjects; i++) {
          const cubeMesh = addcube();
          cubeMesh.updateMatrix();
          geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
        }
        scene.add(new THREE.Mesh(geometry, cubeMaterial));
      } else {
        for (let i = 0; i < controls.numberOfObjects; i++) {
          scene.add(controls.addCube());
        }
      }
    };

    this.addCube = addcube;

    this.outputObjects = function () {
      console.log(scene.children);
    };
  })();

  const gui = new dat.GUI();

  gui.add(controls, "numberOfObjects", 0, 20000);
  gui.add(controls, "combined").onChange(controls.redraw);
  gui.add(controls, "redraw");

  controls.redraw();

  let rotation = 0;
  render();

  function addcube() {
    const cubeSize = 1.0;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube randomly in the scene
    cube.position.x = -60 + Math.round(Math.random() * 100);
    cube.position.y = Math.round(Math.random() * 10);
    cube.position.z = -150 + Math.round(Math.random() * 175);

    // add the cube to the scene
    return cube;
  }

  function render() {
    stats.update();

    rotation += 0.005;
    camera.position.x = Math.sin(rotation) * 50;
    // camera.position.y = Math.sin(rotation) * 40;
    camera.position.z = Math.cos(rotation) * 50;
    camera.lookAt(scene.position);

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
