import * as THREE from './ThreeJS/build/three.module.js';
import { OrbitControls } from './ThreeJS/examples/jsm/controls/OrbitControls.js';
import * as dat from './ThreeJS/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from './ThreeJS/examples/jsm/loaders/GLTFLoader.js';

//Create Object Form handling
const objects = new Array(); //All objects stored in array

document.getElementById("Aanmaakknop").addEventListener("click", ()=>{

    //Fetch value from the form
    let L = document.getElementById("L").value;
    let B = document.getElementById("B").value;
    let H = document.getElementById("H").value;
    let kleur = document.getElementById("kleur").value;
    let vwpNaam = document.getElementById("naam").value;

    //Check for empty inputs
    if( L == ""){ console.log("Vul de lengte in van je voorwerp!"); }
    if( B == ""){ console.log("Vul de breedte in van je voorwerp!"); }
    if( H == ""){ console.log("Vul de hoogte in van je voorwerp!"); }
    if( vwpNaam == ""){ console.log("Vul een naam in voor het voorwerp!")}

    //Formate colourhex to RGB
    let rk = (parseInt(kleur.substr(1,2), 16))/255;
    let gk = (parseInt(kleur.substr(3,2), 16))/255;
    let bk = (parseInt(kleur.substr(5,2), 16))/255;

    //Push usermade voorwerp in objects
    if( L != "" && B != "" && H != "" && vwpNaam != ""){ objects.push([vwpNaam, L, B, H, rk, gk, bk]); }
    
    console.table(objects);

    makeBoxes();
});

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

//Make userboxes
function makeBoxes(){
    //Loop the array to create all boxes
    for(let i = 0; i < objects.length; i++){            
        
        var geometry = new THREE.BoxGeometry(objects[i][1], objects[i][2], objects[i][3]);
        var colorbox = new THREE.Color(objects[i][4], objects[i][5], objects[i][6]);
        var material = new THREE.MeshBasicMaterial({color: colorbox});

        switch(i){
            case 0:
                const cube0 = new THREE.Mesh(geometry, material);
                scene.add(cube0);
                break;
            case 1:
                const cube1 = new THREE.Mesh(geometry, material);
                scene.add(cube1);
                break;
            case 2:
                const cube2 = new THREE.Mesh(geometry, material);
                scene.add(cube2);
                break;    
        }
        

        // var objectAmount = objects[i].length;
        // for(let j = 0; j < objectAmount; j++){
        //     console.log('[' + i + ',' + j + '] = ' + objects[i][j]);
            
        // }
    }
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

init();