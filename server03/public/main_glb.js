import * as THREE from './lib/three/three.module.js';
import { GLTFLoader } from './lib/three/loaders/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.scene_glb');

// scene
const scene = new THREE.Scene();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 8, 15);
scene.add(directionalLight);

// load glb object
const models = ['./model/dodge_viper_gts.glb',
          './model/mazdaVisionGranTorismo.glb',
          './model/MitaFreeSampleV1.glb',
          './model/free_1975_porsche_911_930_turbo.glb'];
const model_count = models.length;
var model;
const loader = new GLTFLoader();
loader.load(models[3], gltf => {
  model = gltf.scene;
  scene.add(model);
}, undefined, error => {
  console.error('Error loading model:', error);
});

//Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight);
//camera.position.x = 0.5;
//camera.position.y = 60;
//camera.position.z = 40;
//camera.lookAt(0,50,0);
//camera.position.x = 0.5;
camera.position.y = 3;
camera.position.z = 5;
camera.lookAt(0,1,0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);

//renderer.render(scene, camera);

var count = 0;
function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.01;
  }
  else {
    console.log('Loading...');
  }
  renderer.render(scene, camera);
}
animate();