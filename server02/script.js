import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// scene
const scene = new THREE.Scene();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

//const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//directionalLight.position.set(5, 10, 7.5);
//scene.add(directionalLight);

// Geometry objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial({color: 0xffff00});
const materials = [
  new THREE.MeshBasicMaterial({ color: 'red' }),     // right
  new THREE.MeshBasicMaterial({ color: 'green' }),   // left
  new THREE.MeshBasicMaterial({ color: 'blue' }),    // top
  new THREE.MeshBasicMaterial({ color: 'yellow' }),  // bottom
  new THREE.MeshBasicMaterial({ color: 'cyan' }),    // front
  new THREE.MeshBasicMaterial({ color: 'magenta' })  // back
];

//const mesh = new THREE.Mesh(geometry, material);
const mesh = new THREE.Mesh(geometry, materials);
scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
//camera.position.x = 0.5;
//camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);

//renderer.render(scene, camera);

var count = 0;
function animate() {
  requestAnimationFrame(animate);
  count++;
  if (count > 60) {
    const randomColor = '#' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const surface = Math.floor(Math.random() * 6);
    mesh.material[surface].color.set(randomColor);
    count = 0;
  }
  mesh.rotation.x += Math.random()/20;
  mesh.rotation.y += Math.random()/50;
  mesh.rotation.z += Math.random()/50;
  renderer.render(scene, camera);
}
animate();