function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(10, 10, 10));
  const loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const loader = new THREE.PDBLoader();

  // also possible to use diamond.pdb
  // loader.load("../../assets/models/molecules/aspirin.pdb", function (geometries) {
  loader.load("../../assets/models/molecules/diamond.pdb", function (
    geometries
  ) {
    const group = new THREE.Object3D();

    // create the atoms
    const geometryAtoms = geometries.geometryAtoms;

    for (let i = 0; i < geometryAtoms.attributes.position.count; i++) {
      const startPosition = new THREE.Vector3();
      startPosition.x = geometryAtoms.attributes.position.getX(i);
      startPosition.y = geometryAtoms.attributes.position.getY(i);
      startPosition.z = geometryAtoms.attributes.position.getZ(i);

      const color = new THREE.Color();
      color.r = geometryAtoms.attributes.color.getX(i);
      color.g = geometryAtoms.attributes.color.getY(i);
      color.b = geometryAtoms.attributes.color.getZ(i);

      const material = new THREE.MeshPhongMaterial({
        color: color,
      });

      const sphere = new THREE.SphereGeometry(0.2);
      const mesh = new THREE.Mesh(sphere, material);
      mesh.position.copy(startPosition);
      group.add(mesh);
    }

    // create the bindings
    const geometryBonds = geometries.geometryBonds;

    for (let j = 0; j < geometryBonds.attributes.position.count; j += 2) {
      const startPosition = new THREE.Vector3();
      startPosition.x = geometryBonds.attributes.position.getX(j);
      startPosition.y = geometryBonds.attributes.position.getY(j);
      startPosition.z = geometryBonds.attributes.position.getZ(j);

      const endPosition = new THREE.Vector3();
      endPosition.x = geometryBonds.attributes.position.getX(j + 1);
      endPosition.y = geometryBonds.attributes.position.getY(j + 1);
      endPosition.z = geometryBonds.attributes.position.getZ(j + 1);

      // use the start and end to create a curve, and use the curve to draw
      // a tube, which connects the atoms
      const path = new THREE.CatmullRomCurve3([startPosition, endPosition]);
      const tube = new THREE.TubeGeometry(path, 1, 0.04);
      const material = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
      });
      const mesh = new THREE.Mesh(tube, material);
      group.add(mesh);
    }

    loaderScene.render(group, camera);
  });
}
