import * as THREE from '/lib/three/three.module.js';

import Stats from '/lib/three/jsm/libs/stats.module.js';
import { GUI } from '/lib/three/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';
import { DRACOLoader } from '/lib/three/jsm/loaders/DRACOLoader.js';

import { CNVMONT_menus } from '/lib/cnvmont/utils_cnvmont.js';
import { CNVMONT_utils } from '/lib/cnvmont/utils_cnvmont.js';

let modelLoaded = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Normal pointing up, Y = 0
const editStatus = {'action': 'none', 'type': 'none'};

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById( 'container' );
container.appendChild(renderer.domElement);
//document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Ground
let size_x = 30;
let size_y = 30;
const gridHelper = new THREE.GridHelper(size_x, size_y);
scene.add(gridHelper);

// Object List
const objects = [];

// menus
const menus = [{'title': 'File', 'items':['Open', 'Save', 'Save As ...', 'Exit']},
			{'title': 'Edit', 'items':[
					{'title': 'Selected', 'items': ['Add Cube', 'Add Sphere', 'Add Cylinder']},
					{'title': 'Random', 'items': ['Add Random Cube', 'Add Random Sphere', 'Add Random Cylinder']},
				]}, 
			] 
const cnvmont_utils = new CNVMONT_utils(4.0, 1.3);
const menuControl = new CNVMONT_menus(menus, editStatus, size_x, size_y); 
const controlPanel = menuControl.createPanel(scene, objects);
if(showControl == 'false') {
	controlPanel.domElement.style.display = 'none';
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/lib/three/jsm/libs/draco/gltf/' );
const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
console.log(`modelPath = ${modelPath}`);
if(modelPath.includes('editing')) {
	modelPath = modelPath.replace('editing', 'model');
	console.log(`modelPath = ${modelPath}`);
}
if (modelPath != 'blank') {
	loader.load( modelPath, function ( gltf ) {

		const model = gltf.scene;
		//model.position.set( 1, 1, 0 );
		//model.scale.set( 0.01, 0.01, 0.01 );
		cnvmont_utils.fitModelToView(model, camera, controls);
		
		if (gltf.animations && gltf.animations.length > 0) {
			const size = new THREE.Vector3();
			const box = new THREE.Box3().setFromObject(model);
			box.getSize(size);
			//console.log(`Scaled Model size = (${size.x}, ${size.y}, ${size.z})`)
			scene.add( model );
			mixer = new THREE.AnimationMixer( model );
			mixer.clipAction( gltf.animations[ 0 ] ).play();
			animationExist = true;
		}
		else {
			const size = new THREE.Vector3();
			const box = new THREE.Box3().setFromObject(model);
			box.getSize(size);
			//console.log(`Scaled Model size = (${size.x}, ${size.y}, ${size.z})`)
			scene.add( model );
		}

		renderer.setAnimationLoop( animate );
		modelLoaded = true;
	}, function (xhr) {
		const percent = (xhr.loaded / xhr.total) * 100;
		document.getElementById('progress_glb').style.width = `${percent}%`;
		document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
	}, function ( e ) {
		console.error('Error loading model: ', e );
	} );
}

// Add Object
function addObject(type, position) {
	var geometry = null;
	//console.log(`type = ${type}, position = ${position}`);
	
	switch (type) {
		case 'Cube':
			geometry = new THREE.BoxGeometry();
			break;
		case 'Sphere':
			geometry = new THREE.SphereGeometry(0.5, 32, 32);
			break;
		case 'Cylinder':
			geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
			break;
		default:
			geometry = new THREE.BoxGeometry();
			break;
	}
	
	//console.log(`geometry = ${geometry}`);
	const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
	const material = new THREE.MeshStandardMaterial({ color: randomColor });
	const obj = new THREE.Mesh(geometry, material);
	obj.position.set(position.x, position.y+0.5, position.z);
	scene.add(obj);
	objects.push(obj);
}

function isPanelEvent(event) {
	const rect = controlPanel.domElement.getBoundingClientRect();
	const isInside = (
		event.clientX >= rect.left &&
		event.clientX <= rect.right &&
		event.clientY >= rect.top &&
		event.clientY <= rect.bottom
	);

	if (isInside || event.target.id.includes('lil-gui'))
		return true;
	return false;
}

/*
// Add Sphere
window.addSphere = function() {
	const geometry = new THREE.SphereGeometry(0.5, 32, 32);
	const material = new THREE.MeshStandardMaterial({ color: 0xff7700 });
	const sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(Math.random()*2-1, 0.5, Math.random()*2-1);
	scene.add(sphere);
	objects.push(sphere);
}
*/

// Animate
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

modelLoaded = true;
if(modelLoaded) {
	document.getElementById('progress_glb').style.display = "none";
}

animate();

// Resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
	const isPanel = isPanelEvent(event);
	if(isPanel || editStatus['action'] == 'none') return;
	// Convert mouse position to normalized device coordinates (-1 to +1)
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Update raycaster with camera and mouse
	raycaster.setFromCamera(mouse, camera);

	// Check for intersections with objects in the scene
	let intersectionPoint = new THREE.Vector3();
	const intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length > 0) {
		intersectionPoint = intersects[0].point; // 3D coordinates of the clicked point
		//const object = intersects[0].object; // The object that was clicked
		//console.log('Clicked point:', intersectionPoint);
		//console.log('Clicked object:', object);
	}
	else {
		raycaster.ray.intersectPlane(plane, intersectionPoint);
	}

	if (intersectionPoint) {
		//console.log('Clicked world coordinate on X-Z plane:', intersectionPoint);
		//console.log(`editStatus["action"] = ${editStatus["action"]}, editStatus["type"] = ${editStatus["type"]}`);
		addObject(editStatus['type'], intersectionPoint);
		editStatus['action'] = 'none';
	}
});
