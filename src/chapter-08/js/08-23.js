function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  const loaderScene = new BaseLoaderScene(camera);

  const loader = new THREE.PRWMLoader();

  loader.load("../../assets/models/cerberus/cerberus.be.prwm", function (
    geometry
  ) {
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    const mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    mesh.scale.set(30, 30, 30);
    loaderScene.render(mesh, camera);
  });
}
