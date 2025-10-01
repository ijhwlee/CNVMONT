import * as THREE from '/lib/three/three.module.js';

import Stats from '/lib/three/jsm/libs/stats.module.js';
import { GUI } from '/lib/three/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';

import { CNVMONT_menus } from '/lib/cnvmont/utils_cnvmont.js';

let modelLoaded = false;
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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Ground
	let size_x = 30;
	let size_y = 30;
    const gridHelper = new THREE.GridHelper(size_x, size_y);
    scene.add(gridHelper);

	//if (showControl == 'false') {
	//	document.getElementById('ui').style.display='none';
	//}

    // Object List
    const objects = [];

	// menus
    const menus = [{'title': 'File', 'items':['Open', 'Save', 'Save As ...', 'Exit']},
               {'title': 'Edit', 'items':['Add Cube', 'Add Sphere', 'Add Cylinder']}, 
				] 
	const menuControl = new CNVMONT_menus(menus, size_x, size_y); 
	const controlPanel = menuControl.createPanel(scene, objects);
	if(showControl == 'false') {
		controlPanel.domElement.style.display = 'none';
	}

	// Add Cube
    window.addCube = function() {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(Math.random()*2-1, 0.5, Math.random()*2-1);
      scene.add(cube);
      objects.push(cube);
    }

    // Add Sphere
    window.addSphere = function() {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({ color: 0xff7700 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(Math.random()*2-1, 0.5, Math.random()*2-1);
      scene.add(sphere);
      objects.push(sphere);
    }

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




/*
import * as THREE from '/lib/three/three.module.js';

import Stats from '/lib/three/jsm/libs/stats.module.js';
import { GUI } from '/lib/three/jsm/libs/lil-gui.module.min.js';

import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';

import { CNVMONT_utils } from '/lib/cnvmont/utils_cnvmont.js';

let scene, renderer, camera, stats, controls;
let model, skeleton, mixer, clock;
let controlPanel;

const crossFadeControls = [];

let idleAction;
let actionClips, actionWeights, actionNames, modifyNames, crossFades, toIdleIndex;
let actions, settings;

let singleStepMode = false;
let sizeOfNextStep = 0;

let modelLoaded = false;

init();

function init() {

	const container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
	camera.position.set( 1, 2, - 3 );
	camera.lookAt( 0, 1, 0 );

	clock = new THREE.Clock();

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xa0a0a0 );
	scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
	hemiLight.position.set( 0, 20, 0 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set( - 3, 10, - 10 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
	scene.add( dirLight );

	// scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

	// ground

	const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) );
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );

	const cnvmont_utils = new CNVMONT_utils();

	const loader = new GLTFLoader();
	loader.load( modelPath, function ( gltf ) {

		model = gltf.scene;
		cnvmont_utils.fitModelToView(model, camera, controls);
		//camera.position.set( 1, 2, - 3 );
		//camera.lookAt( 0, 1, 0 );
		scene.add( model );

		model.traverse( function ( object ) {

			if ( object.isMesh ) object.castShadow = true;

		} );

		//

		skeleton = new THREE.SkeletonHelper( model );
		skeleton.visible = false;
		scene.add( skeleton );

		//
		actionNames = [];
		actionClips = [];
		actionWeights = [];
		const animations = gltf.animations;
		for(let i = 0; i<animations.length; i++) {
			//console.log(`Animation[${i}]:`);
			//console.log(`    name = ${animations[i].name}`);
			//console.log(`    duration = ${animations[i].duration}`);
			//console.log(`    uuid = ${animations[i].uuid}`);
			//console.log(`    tracks = ${animations[i].tracks}`);
			actionNames.push(animations[i].name);
			actionClips.push(animations[i]);
			actionWeights.push(0.0);
			if (animations[i].name.toUpperCase() === 'WALK' ||
				animations[i].name.toUpperCase() === 'WALKING') {
				actionWeights[i] = 1.0;
			}
		}

		mixer = new THREE.AnimationMixer( model );

		actions = [];
		for(let i = 0; i<animations.length; i++) {
			const action = mixer.clipAction( animations[ i ] );
			if (actionNames[i].toUpperCase() === 'IDLE') {
				idleAction = action;
			}
			actions.push(action);
		}
		//
		createPanel();
		
		activateAllActions();

		renderer.setAnimationLoop( animate );
		modelLoaded = true;
		if(modelLoaded) {
			document.getElementById('progress_glb').style.display = "none";
		}

	}, function (xhr) {
		const percent = (xhr.loaded / xhr.total) * 100;
		document.getElementById('progress_glb').style.width = `${percent}%`;
		document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
	} );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );

	controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set( 0, 0.5, 0 );
	controls.update();
	controls.enablePan = false;
	controls.enableDamping = true;

	
	stats = new Stats();
	container.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );

}

function createPanel() {

	const panel = new GUI( { width: 310 } );

	const folder1 = panel.addFolder( 'Visibility' );
	const folder2 = panel.addFolder( 'Activation/Deactivation' );
	const folder3 = panel.addFolder( 'Pausing/Stepping' );
	const folder4 = panel.addFolder( 'Crossfading' );
	const folder5 = panel.addFolder( 'Blend Weights' );
	const folder6 = panel.addFolder( 'General Speed' );

	settings = {
		'show model': true,
		'show skeleton': false,
		'deactivate all': deactivateAllActions,
		'activate all': activateAllActions,
		'pause/continue': pauseContinue,
		'make single step': toSingleStepMode,
		'modify step size': 0.05,
		'use default duration': true,
		'set custom duration': 3.5,
		'modify time scale': 1.0
	};
	modifyNames = [];
	actionNames.forEach(function(name) {
		const fieldName = `modify ${name} weight`;
		modifyNames.push(fieldName);
		settings[fieldName] = 0.0;
		if (name.toUpperCase() === 'WALK' || name.toUpperCase() === 'WALKING')
			settings[fieldName] = 1.0;
	} );
	crossFades = [];
	let idx = 0;
	for (let i=0; i < actions.length; i++) {
		for (let j=0; j < actions.length; j++) {
			if (i != j) {
				const fieldName = `from ${actionNames[i]} to ${actionNames[j]}`;
				crossFades.push(fieldName);
				//console.log(`actionNames[${j}] = ${actionNames[j]}`);
				if (actionNames[j].toUpperCase() === 'IDLE')
					toIdleIndex = idx;
				idx++;
				let duration = 1.0;
				settings[fieldName] = function() {
					prepareCrossFade( actions[i], actions[j], duration );
				}
			}
		}
	}
	console.log(`toIdleIndex = ${toIdleIndex}`);
	
	folder1.add( settings, 'show model' ).onChange( showModel );
	folder1.add( settings, 'show skeleton' ).onChange( showSkeleton );
	folder2.add( settings, 'deactivate all' );
	folder2.add( settings, 'activate all' );
	folder3.add( settings, 'pause/continue' );
	folder3.add( settings, 'make single step' );
	folder3.add( settings, 'modify step size', 0.01, 0.1, 0.001 );
	//console.log(`crossFades.length = ${crossFades.length}`);
	for (let i=0; i < crossFades.length; i++) {
		crossFadeControls.push( folder4.add( settings, crossFades[i] ) );
	}
	//console.log(`crossFadeContols.length = ${crossFadeControls.length}`);
	folder4.add( settings, 'use default duration' );
	folder4.add( settings, 'set custom duration', 0, 10, 0.01 );
	for (let i=0; i < modifyNames.length; i++) {
		folder5.add( settings, modifyNames[i], 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {
			setWeight( actions[i], weight );
		} );
	}
	folder6.add( settings, 'modify time scale', 0.0, 1.5, 0.01 ).onChange( modifyTimeScale );

	folder1.open();
	folder2.open();
	folder3.open();
	folder4.open();
	folder5.open();
	folder6.open();
	controlPanel = panel;
}


function showModel( visibility ) {

	model.visible = visibility;

}


function showSkeleton( visibility ) {

	skeleton.visible = visibility;

}


function modifyTimeScale( speed ) {

	mixer.timeScale = speed;

}


function deactivateAllActions() {

	actions.forEach( function ( action ) {

		action.stop();

	} );

}

function activateAllActions() {

	for (let i = 0; i < actions.length; i++) {
		setWeight( actions[i], settings[ modifyNames[i] ] );
	}

	actions.forEach( function ( action ) {

		action.play();

	} );

}

function pauseContinue() {

	if ( singleStepMode ) {

		singleStepMode = false;
		unPauseAllActions();

	} else {

		if ( idleAction.paused ) {

			unPauseAllActions();

		} else {

			pauseAllActions();

		}

	}

}

function pauseAllActions() {

	actions.forEach( function ( action ) {

		action.paused = true;

	} );

}

function unPauseAllActions() {

	actions.forEach( function ( action ) {

		action.paused = false;

	} );

}

function toSingleStepMode() {

	unPauseAllActions();

	singleStepMode = true;
	sizeOfNextStep = settings[ 'modify step size' ];

}

function prepareCrossFade( startAction, endAction, defaultDuration ) {

	// Switch default / custom crossfade duration (according to the user's choice)

	const duration = setCrossFadeDuration( defaultDuration );

	// Make sure that we don't go on in singleStepMode, and that all actions are unpaused

	singleStepMode = false;
	unPauseAllActions();

	// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
	// else wait until the current action has finished its current loop

	if ( startAction === idleAction ) {

		executeCrossFade( startAction, endAction, duration );

	} else {

		synchronizeCrossFade( startAction, endAction, duration );

	}

}

function setCrossFadeDuration( defaultDuration ) {

	// Switch default crossfade duration <-> custom crossfade duration

	if ( settings[ 'use default duration' ] ) {

		return defaultDuration;

	} else {

		return settings[ 'set custom duration' ];

	}

}

function synchronizeCrossFade( startAction, endAction, duration ) {

	mixer.addEventListener( 'loop', onLoopFinished );

	function onLoopFinished( event ) {

		if ( event.action === startAction ) {

			mixer.removeEventListener( 'loop', onLoopFinished );

			executeCrossFade( startAction, endAction, duration );

		}

	}

}

function executeCrossFade( startAction, endAction, duration ) {

	// Not only the start action, but also the end action must get a weight of 1 before fading
	// (concerning the start action this is already guaranteed in this place)

	setWeight( endAction, 1 );
	endAction.time = 0;

	// Crossfade with warping - you can also try without warping by setting the third parameter to false

	startAction.crossFadeTo( endAction, duration, true );

}

// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
// the start action's timeScale to ((start animation's duration) / (end animation's duration))

function setWeight( action, weight ) {

	action.enabled = true;
	action.setEffectiveTimeScale( 1 );
	action.setEffectiveWeight( weight );

}

// Called by the render loop

function updateWeightSliders() {

	for (let i=0; i < actions.length; i++) {
		settings[ modifyNames[i] ] = actionWeights[i];
	}

}

// Called by the render loop

function updateCrossFadeControls() {

	let weightSum = 0.0;
	for (let i = 0; i < actionWeights.length; i++) {
		weightSum += actionWeights[i];
	}
	//console.log(`weightSum = ${weightSum}`);
	for (let i=0; i < actions.length; i++) {
		if (Math.abs(actionWeights[i] - 1) <= 1.0e-4 && Math.abs(weightSum - 1) <= 1.0e04) {
			for (let j = 0; j < crossFades.length; j++) {
				crossFadeControls[ j ].disable();
			}
			for (let j = 0; j < crossFades.length; j++) {
				if (crossFades[j].includes(`from ${actionNames[i]}`))
					crossFadeControls[ j ].enable();
			}
		}
	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	for (let i = 0; i < actions.length; i++) {
		actionWeights[i] = actions[i].getEffectiveWeight();
	}

	// Update the panel values if weights are modified from "outside" (by crossfadings)

	updateWeightSliders();

	// Enable/disable crossfade controls according to current weight values

	updateCrossFadeControls();

	// Get the time elapsed since the last frame, used for mixer update (if not in single step mode)

	let mixerUpdateDelta = clock.getDelta();

	// If in single step mode, make one step and then do nothing (until the user clicks again)

	if ( singleStepMode ) {

		mixerUpdateDelta = sizeOfNextStep;
		sizeOfNextStep = 0;

	}

	// Update the animation mixer, the stats panel, and render this frame

	mixer.update( mixerUpdateDelta );

	renderer.render( scene, camera );

	stats.update();
	if(showControl == 'false') {
		controlPanel.domElement.style.display = 'none';
	}

}
*/