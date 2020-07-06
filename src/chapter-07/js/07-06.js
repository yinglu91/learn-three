function init() {
  const stats = initStats();
  const camera = initCamera(new THREE.Vector3(20, 0, 150));
  const scene = new THREE.Scene();
  const webGLRenderer = initRenderer();

  createSprites();
  render();

  function createSprites() {
    const material = new THREE.SpriteMaterial({
      map: createGhostTexture(),
      color: 0xffffff,
    });

    const range = 500;
    for (let i = 0; i < 1500; i++) {
      const sprite = new THREE.Sprite(material);
      sprite.position.set(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2
      );
      sprite.scale.set(4, 4, 4);
      scene.add(sprite);
    }
  }

  function render() {
    stats.update();
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}
