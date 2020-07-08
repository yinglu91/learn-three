function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(50, 50, 50));
  const loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath("../../assets/models/butterfly/");
  mtlLoader.load("butterfly.mtl", function (materials) {
    materials.preload();

    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load("../../assets/models/butterfly/butterfly.obj", function (
      object
    ) {
      // move wings to more horizontal position
      [0, 2, 4, 6].forEach(function (i) {
        object.children[i].rotation.z = 0.3 * Math.PI;
      });

      [1, 3, 5, 7].forEach(function (i) {
        object.children[i].rotation.z = -0.3 * Math.PI;
      });

      // configure the wings,
      const wing2 = object.children[5];
      const wing1 = object.children[4];

      wing1.material.opacity = 0.9;
      wing1.material.transparent = true;
      wing1.material.depthTest = false;
      wing1.material.side = THREE.DoubleSide;

      wing2.material.opacity = 0.9;
      wing2.material.depthTest = false;
      wing2.material.transparent = true;
      wing2.material.side = THREE.DoubleSide;

      object.scale.set(140, 140, 140);
      mesh = object;

      object.rotation.x = 0.2;
      object.rotation.y = -1.3;

      loaderScene.render(mesh, camera);
    });
  });
}
