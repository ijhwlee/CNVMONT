import * as THREE from './lib/three/three.module.js';

function getLocalDir(object, x, y, z) {
  const worldDir = new THREE.Vector3(x, y, z).normalize(); // example world direction
  const localDir = worldDir.clone();

  // Apply inverse of the object's world matrix
  object.updateMatrixWorld(); // ensure matrixWorld is up to date
  const inverseMatrix = new THREE.Matrix4().copy(object.matrixWorld).invert();
  localDir.applyMatrix4(inverseMatrix).normalize();
  return localDir;
}

var mouseDown = false;
var prevX = 0, prevY = 0;
var curX = 0, curY = 0;
var angleX = 0, angleY = 0;
var viewAngle = 0;
const minViewAngle = 1;
const maxViewAngle = 179;
const zoomSpeed = 50;  // smaller -> fast zoom
const rotateSpeed = 100; // smaller -> fast rotation
function mouseDownEventHandler(event) {
  console.log(`Mouse down event handler! click at (${event.x}, ${event.y})`);
  mouseDown = true;
  prevX = curX = event.x;
  prevY = curY = event.y;
  const direction = new THREE.Vector3();
  cube.getWorldDirection(direction);
  //console.log(`Initial Cube direction = (${direction.x}, ${direction.y}, ${direction.z})`); // normalized vector
  //var localDir = getLocalDir(cube, 0, 1, 0);
  //console.log(`Initial Local direction of (0,1,0) = (${localDir.x}, ${localDir.y}, ${localDir.z})`); // normalized vector
  //localDir = getLocalDir(cube, 1, 0, 0);
  //console.log(`Initial Local direction of (1,0,0) = (${localDir.x}, ${localDir.y}, ${localDir.z})`); // normalized vector
  //localDir = getLocalDir(cube, 0, 0, 1);
  //console.log(`Initial Local direction of (0,0,1) = (${localDir.x}, ${localDir.y}, ${localDir.z})`); // normalized vector
}
function mouseUpEventHandler(event) {
  console.log(`Mouse up event handler! click at (${event.x}, ${event.y})`);
  mouseDown = false;
}
function mouseMoveEventHandler(event) {
  if(mouseDown) {
    //const direction = new THREE.Vector3();
    //cube.getWorldDirection(direction);
    //console.log(`Cube direction = (${direction.x}, ${direction.y}, ${direction.z})`); // normalized vector
    const localDirY = getLocalDir(cube, 0, 1, 0);
    //console.log(`Local direction of (0,1,0) = (${localDirY.x}, ${localDirY.y}, ${localDirY.z})`); // normalized vector
    const localDirX = getLocalDir(cube, 1, 0, 0);
    //console.log(`Local direction of (1,0,0) = (${localDirX.x}, ${localDirX.y}, ${localDirX.z})`); // normalized vector
    const localDirZ = getLocalDir(cube, 0, 0, 1);
    //console.log(`Local direction of (0,0,1) = (${localDirZ.x}, ${localDirZ.y}, ${localDirZ.z})`); // normalized vector
    //console.log(`Mouse move event handler! move at (${event.x}, ${event.y}), mouseDown = ${mouseDown}`);
    angleX = event.y - prevY;
    angleY = event.x - prevX;
    prevX = event.x;
    prevY = event.y;
    // TODO find the correct angle rotation with respect to direction
    const quaternionX = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(localDirX, angleX/rotateSpeed);
    const eulerX = new THREE.Euler();
    eulerX.setFromQuaternion(quaternionX, 'XYZ');
    const quaternionY = new THREE.Quaternion();
    quaternionY.setFromAxisAngle(localDirY, angleY/rotateSpeed);
    const eulerY = new THREE.Euler();
    eulerY.setFromQuaternion(quaternionY, 'XYZ');
    cube.rotation.x += eulerX.x + eulerY.x;
    cube.rotation.y += eulerX.y + eulerY.y;
    cube.rotation.z += eulerX.z + eulerY.z;
    //cube.rotation.x += angleX/rotateSpeed;
    //cube.rotation.y += angleY/rotateSpeed;
    //console.log(`Mouse move event handler! angleX = ${angleX}, angleY = ${angleY}`);
  }
}
function mouseWheelEventHandler(event) {
  //console.log(`Mouse wheel event handler! move at (${event.x}, ${event.y}), mouseDown = ${mouseDown}`);
  event.preventDefault();
  //console.log(`Mouse wheel event handler! deltaY = ${event.deltaY}`);
  viewAngle += event.deltaY/zoomSpeed;
  if (viewAngle < minViewAngle)
    viewAngle = minViewAngle;
  if (viewAngle > maxViewAngle)
    viewAngle = maxViewAngle;
  console.log(`Mouse wheel event handler! viewAngle = ${viewAngle}`);
  camera.fov = viewAngle;
  camera.updateProjectionMatrix();
}

// Canvas
const canvas = document.querySelector('canvas.scene');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: canvas});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Add a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const materials = [
  new THREE.MeshBasicMaterial({ color: 'red' }),     // right
  new THREE.MeshBasicMaterial({ color: 'green' }),   // left
  new THREE.MeshBasicMaterial({ color: 'blue' }),    // top
  new THREE.MeshBasicMaterial({ color: 'yellow' }),  // bottom
  new THREE.MeshBasicMaterial({ color: 'cyan' }),    // front
  new THREE.MeshBasicMaterial({ color: 'magenta' })  // back
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 5;

var count = 0;
function animate() {
  requestAnimationFrame(animate);
  if (cube) {
    //count++;
    //if (count > 30) {
    //  const randomColor = '#' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    //          + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    //          + Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    //  const surface = Math.floor(Math.random() * 6);
    //  cube.material[surface].color.set(randomColor);
    //  count = 0;
    //}
    //cube.rotation.x += 0.01; //Math.random()/20;
    //cube.rotation.y += 0.01; //Math.random()/50;
    //cube.rotation.z += 0.01 + Math.random()/50;
    renderer.render(scene, camera);
  }
  else {
    console.log('Loading cube...');
  }
}
console.log(`Canvas = ${canvas}`);
if (canvas) {
  //console.log(`Adding eventHandler : ${mouseDownEventHandler}`);
  canvas.onmousedown = mouseDownEventHandler;
  canvas.onmouseup = mouseUpEventHandler;
  canvas.onmousemove = mouseMoveEventHandler;
  canvas.onwheel = mouseWheelEventHandler;
}
animate();