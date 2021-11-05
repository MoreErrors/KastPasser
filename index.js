import * as THREE from './ThreeJS/build/three.module.js';
import { OrbitControls } from './ThreeJS/examples/jsm/controls/OrbitControls.js';
import * as dat from './ThreeJS/examples/jsm/libs/dat.gui.module.js';
import { GLTFLoader } from './ThreeJS/examples/jsm/loaders/GLTFLoader.js';

//Create Object Form handling
let objects = new Array(); //All objects stored in array
document.getElementById("Aanmaakknop").addEventListener("click", ()=>{

    //Fetch value from the form
    let L = (document.getElementById("L").value)/100;
    let B = (document.getElementById("B").value)/100;
    let H = (document.getElementById("H").value)/100;
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
    
    //Add option to dropdown
    var option = document.createElement("Option");
    var optionName = document.createTextNode(vwpNaam);
    option.appendChild(optionName);
    document.getElementById("Voorwerpen").appendChild(option);

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
var cube0;
var cube1;
var cube2;
var cube3;

function makeBoxes(){
    //Loop the array to create all boxes
    for(let i = 0; i < objects.length; i++){            
        
        var geometry = new THREE.BoxGeometry(objects[i][1], objects[i][2], objects[i][3]);
        var colorbox = new THREE.Color(objects[i][4], objects[i][5], objects[i][6]);
        var material = new THREE.MeshBasicMaterial({color: colorbox});

        switch(i){
            case 0:
                cube0 = new THREE.Mesh(geometry, material);
                scene.add(cube0);
                break;
            case 1:
                cube1 = new THREE.Mesh(geometry, material);
                scene.add(cube1);
                break;
            case 2:
                cube2 = new THREE.Mesh(geometry, material);
                scene.add(cube2);
                break;   
            case 3:
                cube3 = new THREE.Mesh(geometry, material);
                scene.add(cube3);
                break;     
        }
    }
}

//Move boxes around
var xAs = 0;
var yAs = 0;
var zAs = 0;

//x-axis
document.getElementById("x-as").addEventListener("click", ()=>{
    xAs = (document.getElementById("x-as").value)/10;
    updateCubePos();
});

//y-axis
document.getElementById("y-as").addEventListener("click", ()=>{
    yAs = (document.getElementById("y-as").value)/10;
    updateCubePos();
});

//z-axis
document.getElementById("z-as").addEventListener("click", ()=>{
    zAs = (document.getElementById("z-as").value)/10;
    updateCubePos();
});

//Update position
function updateCubePos(){
    cube0.position.set(xAs, yAs, zAs);
}

//Display 3D
function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

init();