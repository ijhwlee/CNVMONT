import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.webglb');

// scene
const scene = new THREE.Scene();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 15);
scene.add(directionalLight);

// load glb object
var model;
const loader = new GLTFLoader();
loader.load('./model/dodge_viper_gts.glb', gltf => {
  model = gltf.scene;
  scene.add(model);
}, undefined, error => {
  console.error('Error loading model:', error);
});

//Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth/window.innerHeight);
//camera.position.x = 0.5;
camera.position.y = 8;
camera.position.z = 15;
camera.lookAt(0,0,0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);

//renderer.render(scene, camera);

function animate() {
  requestAnimationFrame(animate);
  model.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();