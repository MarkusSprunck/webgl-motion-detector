/**
 * Copyright (C) 2013, Markus Sprunck
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met:
 *
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above
 *   copyright notice, this list of conditions and the following
 *   disclaimer in the documentation and/or other materials provided
 *   with the distribution.
 *
 * - The name of its contributor may be used to endorse or promote
 *   products derived from this software without specific prior
 *   written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */

var stats, camera, scene, renderer;

if ( Detector.webgl ) {
	init();
	animate();
} else {
	document.body.appendChild( Detector.getWebGLErrorMessage() );
}			
	
function init() {
	
	// add container
	scene = new THREE.Scene();
	var container = document.getElementById('drawingArea');

	// add light
	var light = new THREE.PointLight(0xffffff);
	light.position.set( 0, 250, 0 );
	scene.add(light);
	
	// add cube with six textures
	var materials = [];
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'xpos.png' ) }));
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'xneg.png' ) }));
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'ypos.png' ) }));
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'yneg.png' ) }));
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'zpos.png' ) }));
	materials.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'zneg.png' ) }));
	var geometry = new THREE.CubeGeometry( 3, 3, 3);
	var cube  = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
	scene.add( cube );

	// add camera
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000 );
	scene.add(camera);
	camera.position.set(0 , 0, 10);
	camera.lookAt(scene.position);	
	
	// add renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColorHex(0x0a0a0a, 1);
	
	// Support window resize
    var resizeCallback = function () {
        var offsetHeight = 150;     	
        var devicePixelRatio = window.devicePixelRatio || 1;
        var width = window.innerWidth * devicePixelRatio - 25;
        var height = (window.innerHeight - offsetHeight -10)* devicePixelRatio;
        renderer.setSize(width, height);
        renderer.domElement.style.width = width + 'px';
        renderer.domElement.style.height = height + 'px';
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resizeCallback, false);
    resizeCallback(); 
	container.appendChild( renderer.domElement ); 
	
	// add motion detector
	var motionDetector = new SimpleMotionDetector( camera );	
	motionDetector.domElement.style.position = 'absolute';
 	motionDetector.domElement.style.left = '10px';
 	motionDetector.domElement.style.top = '10px';
    motionDetector.init();
	container.appendChild( motionDetector.domElement );	
	
	// dialog to change parameters
	var gui = new dat.GUI({ autoPlace: false });
	gui.add( motionDetector, 'offsetAlpha', -45.0, 45.0, 5 ).name( 'offset α' );
	gui.add( motionDetector, 'offsetGamma',  -45.0, 45.0, 5 ).name( 'offset γ' );
	gui.add( motionDetector, 'amplificationAlpha', 1.0, 5.0, 0.5 ).name( 'amplification α' );
	gui.add( motionDetector, 'amplificationGamma', 1.0, 5.0, 0.5 ).name( 'amplification γ' );
	gui.add( motionDetector, 'detectionBorder', 0.25, 1.0, 0.05 ).name( 'detection border' );
	gui.add( motionDetector, 'pixelThreshold', 100, 250, 10 ).name( 'pixel threshold' );
	gui.add( motionDetector.averageX, 'maxLength', 200, 2000, 100 ).name( 'averager X' );
	gui.add( motionDetector.averageY, 'maxLength', 200, 2000, 100 ).name( 'averager Y' );
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.left = '10px';
	gui.domElement.style.top = '210px';
	container.appendChild(gui.domElement);
}

function animate() {			
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}	