//import * as THREE from './js/three.js'
//import * as PARSER from './lsystem_parser.js'
//
var shadows = true;
var turtle_stack = [];

var albedo = new THREE.TextureLoader().load("assets/Bark008_2K_Color.jpg");
var normal = new THREE.TextureLoader().load("assets/Bark008_2K_Normal.jpg");
var tree_mat = new THREE.MeshPhongMaterial({
    map: albedo,
    normalMap: normal,
});
function turtle_interpreter(turtle, scene, symbol, theta) {
    switch(symbol) {
        // Turn left by angle theta
        case '+':
            turtle.rotateY(theta);
            break;
    
        // Turn right by angle theta
        case '-':
            turtle.rotateY(-theta);
            break;
    
        // Pitch down by angle theta
        case '&':
            turtle.rotateX(theta);
            break;
            
        // Pitch up by angle theta
        case '^':
            turtle.rotateX(-theta);
            break;
            
        // Roll left by angle theta
        case '\\':
            turtle.rotateZ(theta);
            break;
            
        // Roll right by angle theta
        case '/':
            turtle.rotateZ(-theta);
            break;
            
        // Turn around 180 degrees
        case '|':
            turtle.rotateZ(Math.PI);
            break;

        case 'F':
            var t = turtle;
            t.translateZ(turtle.step_dis/2.0);
            pos = t.position;
            var geometry = new THREE.CylinderBufferGeometry( turtle.begin_radius, turtle.end_radius, turtle.step_dis, 4 );
            //var material = new THREE.MeshBasicMaterial( {color: 0x11ff11} );
            var cylinder = new THREE.Mesh( geometry, tree_mat );
            cylinder.castShadow = shadows;
            cylinder.position.copy(pos);
            cylinder.rotation.set(t.rotation.x, t.rotation.y, t.rotation.z);
            // Correct cylinder rotation
            cylinder.rotateX(Math.PI/2);

            scene.add( cylinder );
            turtle.translateZ(turtle.step_dis/2);
            break;
            
        case '[':
            var t = new THREE.Object3D();
            t.position.copy(turtle.position);
            t.rotation.copy(turtle.rotation);
            turtle_stack.push(t);
            break;
        case ']':
            var t = turtle_stack.pop();
            turtle.position.copy(t.position);
            turtle.rotation.copy(t.rotation);
            break;
    }
}

function generate_tree(mul, depth) {
    var tu = new THREE.Mesh();
    var turtle = new THREE.Object3D();
    turtle.step_dis = 0.1/6*mul;
    turtle.position = new THREE.Vector3();
    turtle.rotateX(-Math.PI/2);
    turtle.end_radius = 0.2/8.0/8*mul;
    turtle.begin_radius = 0.1/8.0/8*mul;
    var string = generate_string(depth);
    //var string = 'F[/+F]+-F';
    //console.log(string)
    //console.log(string.length)
    for (let i = 0, n = string.length; i < n; ++i) {
        turtle_interpreter(turtle, tu, string[i], Math.PI*22.5/180.0);
    }
    return tu;
}


