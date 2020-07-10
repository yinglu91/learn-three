function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera(new THREE.Vector3(0, 20, 40));
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const textureLoader = new THREE.TextureLoader();

  // create a scene and add a light
  const scene = new THREE.Scene();
  scene.background = textureLoader.load(
    "../../assets/textures/bg/starry-deep-outer-space-galaxy.jpg"
  );
  const earthAndLight = addEarth(scene);
  const earth = earthAndLight.earth;
  const pivot = earthAndLight.pivot;

  // setup effects
  const renderPass = new THREE.RenderPass(scene, camera);
  const effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  const bleachByPassFilter = new THREE.ShaderPass(THREE.BleachBypassShader);
  const brightnessContrastShader = new THREE.ShaderPass(
    THREE.BrightnessContrastShader
  );
  const colorifyShader = new THREE.ShaderPass(THREE.ColorifyShader);
  const colorCorrectionShader = new THREE.ShaderPass(
    THREE.ColorCorrectionShader
  );
  const freiChenShader = new THREE.ShaderPass(THREE.FreiChenShader);
  const gammaCorrectionShader = new THREE.ShaderPass(
    THREE.GammaCorrectionShader
  );
  const hueSaturationShader = new THREE.ShaderPass(THREE.HueSaturationShader);
  const kaleidoShader = new THREE.ShaderPass(THREE.KaleidoShader);
  const luminosityHighPassShader = new THREE.ShaderPass(
    THREE.LuminosityHighPassShader
  );
  const luminosityShader = new THREE.ShaderPass(THREE.LuminosityShader);
  const mirrorShader = new THREE.ShaderPass(THREE.MirrorShader);
  const pixelShader = new THREE.ShaderPass(THREE.PixelShader);
  pixelShader.uniforms.resolution.value = new THREE.Vector2(256, 256);
  const rgbShiftShader = new THREE.ShaderPass(THREE.RGBShiftShader);
  const sepiaShader = new THREE.ShaderPass(THREE.SepiaShader);
  const sobelOperatorShader = new THREE.ShaderPass(THREE.SobelOperatorShader);
  sobelOperatorShader.uniforms.resolution.value = new THREE.Vector2(256, 256);
  const vignetteShader = new THREE.ShaderPass(THREE.VignetteShader);

  const composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bleachByPassFilter);
  composer.addPass(brightnessContrastShader);
  composer.addPass(colorifyShader);
  composer.addPass(colorCorrectionShader);
  composer.addPass(freiChenShader);
  composer.addPass(gammaCorrectionShader);
  composer.addPass(hueSaturationShader);
  composer.addPass(kaleidoShader);
  composer.addPass(luminosityHighPassShader);
  composer.addPass(luminosityShader);
  composer.addPass(mirrorShader);
  composer.addPass(pixelShader);
  composer.addPass(rgbShiftShader);
  composer.addPass(sepiaShader);
  composer.addPass(sobelOperatorShader);
  composer.addPass(vignetteShader);
  composer.addPass(effectCopy);

  // setup controls
  const gui = new dat.GUI();
  const controls = {};

  addShaderControl(gui, "BleachBypass", bleachByPassFilter, {
    floats: [{ key: "opacity", from: 0, to: 2, step: 0.01 }],
  });
  addShaderControl(gui, "BrightnessContrast", brightnessContrastShader, {
    floats: [
      { key: "brightness", from: 0, to: 1, step: 0.01 },
      { key: "contrast", from: 0, to: 1, step: 0.01 },
    ],
  });
  addShaderControl(gui, "Colorify", colorifyShader, {
    colors: [{ key: "color" }],
  });
  addShaderControl(gui, "ColorCorrection", colorCorrectionShader, {
    vector3: [
      {
        key: "powRGB",
        from: { x: 0, y: 0, z: 0 },
        to: { x: 5, y: 5, z: 5 },
        step: { x: 0.01, y: 0.01, z: 0.01 },
      },
      {
        key: "mulRGB",
        from: { x: 0, y: 0, z: 0 },
        to: { x: 5, y: 5, z: 5 },
        step: { x: 0.01, y: 0.01, z: 0.01 },
      },
      {
        key: "addRGB",
        from: { x: 0, y: 0, z: 0 },
        to: { x: 1, y: 1, z: 1 },
        step: { x: 0.01, y: 0.01, z: 0.01 },
      },
    ],
  });
  addShaderControl(gui, "FreiChen", freiChenShader, {
    vector2: [
      {
        key: "aspect",
        from: { x: 128, y: 128 },
        to: { x: 1024, y: 1024 },
        step: { x: 1, y: 1 },
      },
    ],
  });
  addShaderControl(gui, "GammaCorrection", gammaCorrectionShader, {});
  addShaderControl(gui, "HueSaturation", hueSaturationShader, {
    floats: [
      { key: "hue", from: -1, to: 1, step: 0.01 },
      { key: "saturation", from: -1, to: 1, step: 0.01 },
    ],
  });
  addShaderControl(gui, "Kaleido", kaleidoShader, {
    floats: [
      { key: "sides", from: 0, to: 20, step: 1 },
      { key: "angle", from: 0, to: 6.28, step: 0.01 },
    ],
  });
  addShaderControl(gui, "LuminosityHighPass", luminosityHighPassShader, {
    colors: [{ key: "defaultColor" }],
    floats: [
      { key: "luminosityThreshold", from: 0, to: 2, step: 0.01 },
      { key: "smoothWidth", from: 0, to: 2, step: 0.01 },
      { key: "defaultOpacity", from: 0, to: 1, step: 0.01 },
    ],
  });
  addShaderControl(gui, "Luminosity", luminosityShader, {});
  addShaderControl(gui, "Mirror", mirrorShader, {
    floats: [{ key: "side", from: 0, to: 3, step: 1 }],
  });
  addShaderControl(gui, "Pixel", pixelShader, {
    vector2: [
      {
        key: "resolution",
        from: { x: 2, y: 2 },
        to: { x: 512, y: 512 },
        step: { x: 1, y: 1 },
      },
    ],
    floats: [{ key: "pixelSize", from: 0, to: 10, step: 1 }],
  });
  addShaderControl(gui, "rgbShift", rgbShiftShader, {
    floats: [
      { key: "angle", from: 0, to: 6.28, step: 0.001 },
      { key: "amount", from: 0, to: 0.5, step: 0.001 },
    ],
  });
  addShaderControl(gui, "sepia", sepiaShader, {
    floats: [{ key: "amount", from: 0, to: 10, step: 0.01 }],
  });
  addShaderControl(gui, "sobelOperator", sobelOperatorShader, {
    vector2: [
      {
        key: "resolution",
        from: { x: 2, y: 2 },
        to: { x: 512, y: 512 },
        step: { x: 1, y: 1 },
      },
    ],
  });
  addShaderControl(gui, "vignette", vignetteShader, {
    floats: [
      { key: "offset", from: 0, to: 10, step: 0.01 },
      { key: "darkness", from: 0, to: 10, step: 0.01 },
    ],
  });

  // do the basic rendering
  render();
  function render() {
    stats.update();
    const delta = clock.getDelta();
    trackballControls.update(delta);

    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
