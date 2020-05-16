function gen_spring(R, circle_steps, height, height_steps) {
    var spring = new THREE.Mesh();
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
    });
    var distance = 0;
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            var angle = p1.angleTo(p2);
            distance = p1.distanceTo(p2);

            var geometry = new THREE.CylinderGeometry( 0.01, 0.01, distance, 6 );
            geometry.rotateX( Math.PI / 2 );

            geometry.verticesNeedUpdate = true;
            geometry.elementsNeedUpdate = true;
            geometry.normalsNeedUpdate = true;

            //var axis = new THREE.AxesHelper(0.5);
            var cylinder = new THREE.Mesh( geometry, material );
            //cylinder.add(axis);
            spring.add( cylinder );
            cylinder.position.x = p1.x;
            cylinder.position.y = p1.y;
            cylinder.position.z = p1.z;
            cylinder.up.set(1, 0, 0);
            cylinder.lookAt(p2);
            //cylinder.rotateX(Math.PI/2);
            cylinder.translateZ(distance/2);
            p1.x = p2.x;
            p1.y = p2.y;
            p1.z = p2.z;
        }
    }
    p2.x = 0;
    p2.y = 0;
    p2.z = height*1.2;
    var radius = R * 1.5;
    var geometry = new THREE.CylinderGeometry( 0.01, 0.01, radius, 6 );
    geometry.rotateX( Math.PI / 2 );

    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    var cylinder = new THREE.Mesh( geometry, material );
    spring.children[spring.children.length - 1].add(cylinder);
    cylinder.translateZ(distance/2);
    cylinder.lookAt(p2);
    cylinder.translateZ(radius/2);

    var geometry = new THREE.SphereGeometry( R, 32, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0x000fff} );
    var sphere = new THREE.Mesh( geometry, material );
    cylinder.add(sphere);
    sphere.translateZ(radius/2);
    //sphere.translateY(-0.2);
    return spring;
}

function gen_spring_tube(R, circle_steps, height, height_steps) {
    function CustomSinCurve( scale ) {

        THREE.Curve.call( this );

        this.scale = ( scale === undefined ) ? 1 : scale;

    }

    CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
    CustomSinCurve.prototype.constructor = CustomSinCurve;

    CustomSinCurve.prototype.getPoint = function ( t ) {

        var tx = R * Math.sin( 20 * Math.PI * t );
        var ty = R * Math.cos( 20 * Math.PI * t );
        var tz = height * t;

        return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

    };
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
    });

    var path = new CustomSinCurve( 1 );
    var geometry = new THREE.TubeBufferGeometry( path, 200, 0.01, 8, false );
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    var mesh = new THREE.Mesh( geometry, material );
    var spring = new THREE.Mesh();
    spring.add(mesh);

    var p2 = new THREE.Vector3();
    p2.x = 0;
    p2.y = 0;
    p2.z = height*1.2;
    var radius = R * 1.5;
    var geometry = new THREE.CylinderGeometry( 0.01, 0.01, radius, 6 );
    geometry.rotateX( Math.PI / 2 );

    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;

    var cylinder = new THREE.Mesh( geometry, material );
    var pos = path.getPoint(1);
    cylinder.position.copy(pos);
    spring.add(cylinder);
    cylinder.rotateX(Math.PI/3);
    cylinder.translateZ(radius/2);
    //cylinder.translateZ(path.getPoint(1));
    //cylinder.translateZ(distance/2);
    //cylinder.lookAt(p2);

    var geometry = new THREE.SphereGeometry( R, 32, 32 );
    var sphere = new THREE.Mesh( geometry, material );
    cylinder.add(sphere);
    sphere.translateZ(radius/2);
    return spring;
}

function gen_spring_lines(R, circle_steps, height, height_steps) {
    var spring = new THREE.Mesh();
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshBasicMaterial({
        map: albedo,
        normalMap: normal,
        linewidth: 5,
    });
    var material = new THREE.LineBasicMaterial( {
        color: 0xffffff,
        linewidth: 5,
        linecap: 'round', //ignored by WebGLRenderer
        linejoin:  'round' //ignored by WebGLRenderer
    } );
    var points = [];
    points.push(new THREE.Vector3(0, R, 0));
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
        }
    }
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var line = new THREE.Line( geometry, material );
    spring.add(line);
    return spring;
}
function update_spring(spring, R, circle_steps, height, height_steps) {
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3(0, 0, 0);
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var idx = 0;
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            var distance = p2.distanceTo(p1);
            var geometry = new THREE.CylinderGeometry( 0.01, 0.01, distance * 1.05, 4 );
            geometry.rotateX( Math.PI / 2 );
            spring.children[idx].geometry.copy(geometry);
            //spring.children[idx].position.set(p1.x, p1.y, p1.z);
            spring.children[idx].rotation.x = 0;
            spring.children[idx].rotation.y = 0;
            spring.children[idx].rotation.z = 0;
            //spring.children[idx].rotateX(-Math.PI/2);
            spring.children[idx].position.x = p1.x;
            spring.children[idx].position.y = p1.y;
            spring.children[idx].position.z = p1.z;
            p1.x = p2.x;
            p1.y = p2.y;
            p1.z = p2.z;
            var p3 = new THREE.Vector3(p2.x, p2.y, p2.z);
            p3.applyMatrix4(spring.matrix);
            //spring.worldToLocal(p2);
            //p2.add(spring.position);
            //p2.applyEuler(spring.rotation);

            spring.children[idx].up.set(1, 0, 0);
            spring.children[idx].lookAt(p3);
            //spring.children[idx].rotateX(Math.PI/2);
            spring.children[idx].translateZ(distance/2);
            idx += 1;
        }
    }
}
function update_spring_line(spring, R, circle_steps, height, height_steps) {
    var theta = 0;
    var p1 = new THREE.Vector3(0, R, 0);
    var p2 = new THREE.Vector3();
    var angle_step = Math.PI*2/circle_steps;
    var step = height/(circle_steps*height_steps);
    var albedo = new THREE.TextureLoader().load("assets/Metal008_2K_Color.jpg");
    var normal = new THREE.TextureLoader().load("assets/Metal008_2K_Normal.jpg");
    var material = new THREE.MeshPhongMaterial({
        map: albedo,
        normalMap: normal,
    });
    var points = [];
    points.push(new THREE.Vector3(0, R, 0));
    for (let j = 0; j < height_steps; ++j) {
        theta = 0;
        for (let i = 0; i < circle_steps; ++i) {
            theta = theta + angle_step;
            p2.x = R * Math.sin(theta); 
            p2.y = R * Math.cos(theta);
            p2.z += step;
            points.push(new THREE.Vector3(p2.x, p2.y, p2.z));
        }
    }
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    spring.children[0].geometry.copy(geometry);
}

function CustomCurve( scale, R, height ) {

    THREE.Curve.call( this );
    this.R = R;
    this.height = height;
    this.scale = ( scale === undefined ) ? 1 : scale;

}

CustomCurve.prototype = Object.create( THREE.Curve.prototype );
CustomCurve.prototype.constructor = CustomCurve;

CustomCurve.prototype.getPoint = function ( t ) {

    var tx = this.R * Math.sin( 20 * Math.PI * t );
    var ty = this.R * Math.cos( 20 * Math.PI * t );
    var tz = this.height * t;

    return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );

};


function update_spring_tube(spring, R, circle_steps, height, height_steps) {
    var path = new CustomCurve( 1, R, height );
    var geometry = new THREE.TubeBufferGeometry( path, 200, 0.01, 8, false );
    spring.children[0].geometry.copy(geometry);
    var pos = path.getPoint(1);
    spring.children[1].position.copy(pos);
    var radius = R * 1.5;
    spring.children[1].translateZ(radius/2);

}