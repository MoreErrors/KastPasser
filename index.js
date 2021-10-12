import * as THREE from './ThreeJS/build/three.module.js';
import { OrbitControls } from './ThreeJS/examples/jsm/controls/OrbitControls.js';
import * as dat from './ThreeJS/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from './ThreeJS/examples/jsm/loaders/GLTFLoader.js';

//Vars
let container;
let scene;
let camera;
let renderer;
let model;
let controls;

function init(){
    //Set scene
    container = document.querySelector('.scene');
    scene = new THREE.Scene();

    //Renderer
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    //Set camera
    const fov = 35;
    const aspect = container.clientWidth/container.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, -10); //x, y, z
    camera.rotation.set(0, 0, 0); //x, y, z

    //Set Light
    const ambient = new THREE.AmbientLight(0xffffff); //colour, intensity
    scene.add(ambient);

    const pointLight = new THREE.DirectionalLight(0xFFFFFF, .5);
    pointLight.position.set(20, 100, 10);
    pointLight.castShadow = true;
    scene.add(pointLight)

    //Load model
    let loader = new GLTFLoader();
    loader.load('./Model/kast.gltf', function(gltf){
        model = gltf.scene;
        scene.add(model);
        model.position.set(0, -2, 0);//x, y, z
        model.rotation.set(0, -3, 0); //x, y, z
    });

    //Rotation
    controls = new OrbitControls(camera, renderer.domElement); //camera pos+rot =! OrbitControls!

    //Allow window resizing
    function onWindowResize(){
        camera.aspect = container.clientWidth/container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);

    //display
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

init();