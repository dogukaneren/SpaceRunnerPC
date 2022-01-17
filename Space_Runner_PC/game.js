//#region Classes
class Cubes {

    constructor(tag, obj) {
        this.tag = tag;
        this.obj = obj;

    }
}

class Collectables {
    constructor(tag, obj, paddingX, paddingY, scale, rotation, score, isHarmful) {
        this.tag = tag;
        this.obj = obj;
        this.paddingX = paddingX;
        this.paddingY = paddingY;
        this.scale = scale;
        this.rotation = rotation;
        this.score = score
        this.isHarmful = isHarmful;
    }
}

//#endregion

//#region Variables
var collectablesIDs = ['cpu',  'gpu', 'floppy', 'cd', 'usb', 'bomb','hdd'];
let collectablesIdIndex = 0;
var collectablesArray = [];
var CubesArray = [];
var usedCollectiblesArray = [];
let score = 0;
let instanceIndex = 0;
let collectableCounter = 0;
var pc = null;
var closestCollectable = null;
var GameReadyToStart = false;
var GamePaused = false;
//#endregion

//#region 3.JS Initialize
const manager = new THREE.LoadingManager();
const loader = new THREE.GLTFLoader(manager);
const textureLoader = new THREE.TextureLoader(manager);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.rotation.y = 0;
scene.add(directionalLight);
//#endregion


//#region Game Initial Scene Set
document.getElementById("TitleDiv").style.visibility = "hidden";
textureLoader.load('assets/bg.jpeg', function (texture) {
    scene.background = texture;
});

//Score sprite
let scoreText = new THREE.TextSprite({
    alignment: 'left',
    color: '#24ff00',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 1,
    fontStyle: 'italic',
    text: 'Score: 0'

});
scene.add(scoreText);
scoreText.position.set(-9, 11, 5);

//#endregion

//#region Loading handling

manager.onProgress = function (item, loaded, total) {
    document.getElementById("TitleDiv").style.visibility = "visible";
    document.getElementById("Title").innerHTML = `Loading...`;
    document.getElementById("Score").style.visibility = "hidden";
    document.getElementById("playAgain").style.visibility = "hidden";

};
manager.onLoad = function () {

    document.getElementById("TitleDiv").style.visibility = "hidden";

    for (var i = 0; i < 15; i++) {
        AutoGenerateCollectables();
    }

    NextClosestCollectable();

    GameReadyToStart = true;
};
//#endregion

var AutoGenerateCollectables = function () {

    let x = Math.floor((Math.random() * 3));
    let y = Math.floor((Math.random() * 3));

    var collectable = collectablesArray[Math.floor((Math.random() * collectablesArray.length))];//

    collectablesArray = RemoveInArray(collectablesArray, collectable);
    usedCollectiblesArray.push(collectable);
    SetObjectTransform(collectable.obj, new THREE.Vector3(-1 + x + collectable.paddingX, 7 + 0.7 * y + collectable.paddingY, -15 - 15 * collectableCounter), collectable.rotation, collectable.scale);
    collectableCounter++;


}

var NextClosestCollectable = function () {
    if (usedCollectiblesArray.length > 0) {

        closestCollectable = usedCollectiblesArray[0];
        usedCollectiblesArray.splice(0, 1);
    }
    else
        console.log('Used Collectable Array is empty');
}

var RemoveInArray = function (array, item) {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}

var loadCollectablesGLTF = function () {

    loader.load(
        // resource URL
        'assets/' + collectablesIDs[collectablesIdIndex] + '/scene.gltf',
        // called when the resource is loaded
        function (gltf) {


            var collectable = null;


            scene.add(gltf.scene);
            gltf.scene.position.set(0, 0, 10000);

            if (collectablesIDs[collectablesIdIndex].includes('cpu')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , 0, 0.2
                    , new THREE.Vector3(0.03, 0.03, 0.03)
                    , new THREE.Vector3(Math.PI / 2, -Math.PI / 2, 0)
                    , 20
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('gpu')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , .6, 0
                    , new THREE.Vector3(0.4, 0.4, 0.4)
                    , new THREE.Vector3(Math.PI / 2, 0, 0)
                    , 25
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('cd')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , 0, 0.3
                    , new THREE.Vector3(0.6, 0.6, 0.6)
                    , new THREE.Vector3(-Math.PI / 2, Math.PI, Math.PI)
                    , 5
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('floppy')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , 0, 0.2
                    , new THREE.Vector3(0.2, 0.2, 0.2)
                    , new THREE.Vector3(0, -Math.PI / 2, 0)
                    , 1
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('hdd')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , -1.35, 2.5
                    , new THREE.Vector3(0.25, 0.25, 0.25)
                    , new THREE.Vector3(Math.PI / 2, -Math.PI / 2, 0)
                    , 10
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('usb')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , -0.7, -.4, new THREE.Vector3(0.2, 0.2, 0.2)
                    , new THREE.Vector3(Math.PI / 2, -Math.PI / 4, 0)
                    , 8
                    , false);
            }
            if (collectablesIDs[collectablesIdIndex].includes('bomb')) {

                collectable = new Collectables(collectablesIDs[collectablesIdIndex] + '' + instanceIndex
                    , gltf.scene
                    , 0, 0.2
                    , new THREE.Vector3(10, 10, 10)
                    , null
                    , 0
                    , true);
            }
            collectablesArray.push(collectable);

            if (collectablesIdIndex < collectablesIDs.length) {

                if (instanceIndex >= 2 && collectablesIdIndex < 7) {
                    collectablesIdIndex++;
                    instanceIndex = 0;
                }
                else {

                    instanceIndex++;
                }

                if (collectablesIdIndex != 7)
                    loadCollectablesGLTF();

            }
        }
    );


}


var AddBasicObjectToScene = function (tag, geo, color, materials, position, rotation, scale) {

    if (!color)
        color = 0xFFFFFF;
    var geometry = geo;
    var material = null;
    if (materials)
        material = new THREE.MeshFaceMaterial(materials);
    else
        material = new THREE.MeshBasicMaterial({ color: color, wireframe: false });
    var obj = new THREE.Mesh(geometry, material);

    SetObjectTransform(obj, position, rotation, scale);
    RenderObject(tag, obj);

}

var SetObjectTransform = function (obj, position, rotation, scale) {
    if (rotation)
        obj.rotation.set(rotation.x, rotation.y, rotation.z);
    if (scale)
        obj.scale.copy(scale);
    if (position) {
        obj.position.copy(position);
    }

}


var RenderObject = function (tag, obj) {

    CubesArray.push(new Cubes(tag, obj));
    scene.add(obj);
}

FindCubeWithTag = function (tag) {

    return CubesArray.find(x => x.tag === tag);
}

var cubeTexture = textureLoader.load('assets/pcb.png');

var cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: cubeTexture }),
    new THREE.MeshBasicMaterial({ map: cubeTexture }),
    new THREE.MeshBasicMaterial({ map: cubeTexture }),
    new THREE.MeshBasicMaterial({ map: cubeTexture }),
    new THREE.MeshBasicMaterial({ map: cubeTexture }),
    new THREE.MeshBasicMaterial({ map: cubeTexture })
]

for(var i = 0;i<=10;i++){

    AddBasicObjectToScene("cube"+i, new THREE.BoxGeometry(15, 1, 15), null, cubeMaterials, new THREE.Vector3(0, 0, -15*i));
}




loader.load(
    // resource URL
    'assets/pc/scene.gltf',
    // called when the resource is loaded
    function (gltf) {


        //PC initial value
        pc = gltf.scene
        scene.add(pc)
        pc.position.copy(new THREE.Vector3(0, 7, 4));
        pc.rotation.y = Math.PI;
        loadCollectablesGLTF();
    }
);


window.addEventListener('keydown', logKey);

function logKey(e) {
    if (GameReadyToStart) {
        if (e.code === "KeyW")
            KeyW();
        if (e.code === "KeyA")
            KeyA();
        if (e.code === "KeyS")
            KeyS();
        if (e.code === "KeyD")
            KeyD();
        if (e.code === "KeyP")
            KeyP();
    }

}

document.getElementById('playAgain').addEventListener('click',function(){
    
    location.reload();
})

camera.position.z = 6;
camera.position.y = 9;
camera.rotation.x = 75;

let countX = 1;
let countY = 0;

var KeyW = function () {
    if (countY < 2) {
        countY++;
        pc.position.y += 0.7;
    }

}
var KeyA = function () {
    if (countX > 0) {
        countX--;
        pc.position.x -= 1;
    }
}
var KeyS = function () {
    if (countY > 0) {
        countY--;
        pc.position.y -= 0.7;
    }
}
var KeyD = function () {
    if (countX < 2) {
        countX++;
        pc.position.x += 1;
    }
}
let counter = 0;
var KeyP = function () {
    GamePaused = counter % 2 == 0;
    counter++;
}
let flag = false, flag2 = false;
let pos = 4;
let textureCounter = 0;
let yol = (pos - 4) * 100;



var update = function () {
    if (GameReadyToStart && !GamePaused) {
        camera.position.z = pos + 2;
        scoreText.position.z = pos - 10;

        if (pc)
            pc.position.z = pos;

        pos -= 0.2;

        directionalLight.position.copy(new THREE.Vector3(camera.position.x - 5, camera.position.y - 200000, pos + 500000));

        if (Math.ceil(pos - 4) * 100 % 1500 == 0 && flag) {
            FindCubeWithTag("cube" + (textureCounter % 11).toString()).obj.position.z = -165 - 15 * textureCounter;
            textureCounter++;
            flag = false;
        }
        else if (Math.ceil(pos - 4) * 100 % 1500 != 0) {
            flag = true;
        }


        if (checkClosestObjectCanBeDestroyed() && flag2) {

            flag2 = false;
            if (checkPcCollidedCollectable()) {
                closestCollectable.obj.position.z = camera.position.z + 5;
                if (closestCollectable.isHarmful) {
                    GameReadyToStart = false;
                    scene.remove(scoreText);
                    document.getElementById("TitleDiv").style.visibility = "visible";
                    document.getElementById("Title").innerHTML = `Game Over`;
                    document.getElementById("Score").innerHTML = `Score: ${score}`
                    document.getElementById("Score").style.visibility = "visible";
                    document.getElementById("playAgain").style.visibility = "visible";
                }
                else {
                    score += closestCollectable.score;
                    scoreText.text = `Score: ${score}`
                }

            }

            collectablesArray.push(closestCollectable);
            AutoGenerateCollectables();
            NextClosestCollectable();
        }
        else
            flag2 = true;
    }

}

var checkClosestObjectCanBeDestroyed = function () {


    return closestCollectable.obj.position.z > pc.position.z


}
var checkPcCollidedCollectable = function () {
    return closestCollectable.obj.position.x - closestCollectable.paddingX == pc.position.x
        && closestCollectable.obj.position.y - closestCollectable.paddingY == pc.position.y
}

var render = function () {
    renderer.render(scene, camera);
}

var GameLoop = function () {
    requestAnimationFrame(GameLoop);

    update();
    render();
}

GameLoop();


