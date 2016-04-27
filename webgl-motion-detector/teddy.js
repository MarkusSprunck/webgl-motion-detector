/**
 * Copyright (C) 2016, Markus Sprunck
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: -
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. - Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. - The name of its contributor may be used to endorse
 * or promote products derived from this software without specific prior written
 * permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 */

Teddy = function() {

	var modifier = new THREE.SubdivisionModifier(2);

	// Create all materials
	this.brownMaterial = new THREE.MeshLambertMaterial({
		color : 0x8B4513
	});

	this.brownLightMaterialerial = new THREE.MeshLambertMaterial({
		color : 0xD2691E
	});

	this.blackMaterial = new THREE.MeshLambertMaterial({
		color : 0x302925
	});

	this.yellowMaterial = new THREE.MeshLambertMaterial({
		color : 0xfdd276
	});

	this.whiteMaterial = new THREE.MeshLambertMaterial({
		color : 0xffffff
	});

	// Create all geometries
	var cylinderDevisions=10;
	var bodyGeom = new THREE.CylinderGeometry(60, 90, 160, cylinderDevisions);
	modifier.modify(bodyGeom);

	var legLegth = 80;
	var legGeom = new THREE.CylinderGeometry(20, 40, legLegth, cylinderDevisions);
	modifier.modify(legGeom);
	
	var clawGeometry = new THREE.CylinderGeometry(0, 7, 12, cylinderDevisions);

	var armRadius= 25;
	var armLegth = 100;
	var armGeom = new THREE.CylinderGeometry(30, armRadius, armLegth, cylinderDevisions);
	armGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));
	modifier.modify(armGeom);

	var faceRadius = 70;
	var faceGeom = new THREE.CylinderGeometry(faceRadius, faceRadius, 70, cylinderDevisions);
	modifier.modify(faceGeom);

	var earGeom = new THREE.CylinderGeometry(30, 30, 20, cylinderDevisions);
	modifier.modify(earGeom);

	var earInnerGeom = new THREE.CylinderGeometry(20, 20, 20, cylinderDevisions);
	modifier.modify(earInnerGeom);
	
	var pawGeometry = new THREE.CylinderGeometry(7, 7, 3, cylinderDevisions);
//	modifier.modify(pawGeometry);
	
	var eyeGeom = new THREE.CylinderGeometry(15, 15, 6, cylinderDevisions);
	modifier.modify(eyeGeom);

	var irisGeom = new THREE.CylinderGeometry(5, 5, 3, cylinderDevisions*2);
	var noseGeom = new THREE.CylinderGeometry(10, 10, 6, cylinderDevisions);
	var mouthTopGeom = new THREE.CylinderGeometry(4, 4, 15, cylinderDevisions);
	var mouthGeometry = new THREE.TorusGeometry(12, 4, 20, 20, Math.PI / 4 * 3);

	// Create all meshes

	// body
	var bodyPosZ = -20;
	this.body = new THREE.Mesh(bodyGeom, this.brownMaterial);
	this.body.position.z = bodyPosZ;
	this.body.position.y = 110;

	// left leg
	var legDistance = 50;
	this.leftLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.leftLeg.position.x = -legDistance;
	this.leftLeg.position.z = bodyPosZ + 30;
	this.leftLeg.position.y = 0;
	this.leftLegClaw1 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw1.position.x = -legDistance+15;
	this.leftLegClaw1.position.z = bodyPosZ + 59;
	this.leftLegClaw1.position.y = 6-legLegth/2;
	this.leftLegClaw1.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw1.rotation.z = -Math.PI / 20;
	this.leftLegClaw2 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw2.position.x = -legDistance;
	this.leftLegClaw2.position.z = bodyPosZ + 63;
	this.leftLegClaw2.position.y = 6-legLegth/2;
	this.leftLegClaw2.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw3 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw3.position.x = -legDistance-15;
	this.leftLegClaw3.position.z = bodyPosZ + 59;
	this.leftLegClaw3.position.y = 6-legLegth/2;
	this.leftLegClaw3.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw3.rotation.z = Math.PI / 20;

	// right leg
	this.rightLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.rightLeg.position.x = legDistance;
	this.rightLeg.position.z = bodyPosZ + 30;
	this.rightLeg.position.y = 0;
	this.rightLegClaw1 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw1.position.x = legDistance-15;
	this.rightLegClaw1.position.z = bodyPosZ + 59;
	this.rightLegClaw1.position.y = 6-legLegth/2;
	this.rightLegClaw1.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw1.rotation.z = Math.PI / 20;
	this.rightLegClaw2 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw2.position.x = legDistance;
	this.rightLegClaw2.position.z = bodyPosZ + 63;
	this.rightLegClaw2.position.y = 6-legLegth/2;
	this.rightLegClaw2.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw3 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw3.position.x = legDistance+15;
	this.rightLegClaw3.position.z = bodyPosZ + 59;
	this.rightLegClaw3.position.y = 6-legLegth/2;
	this.rightLegClaw3.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw3.rotation.z = -Math.PI / 20;


	// left arm
	var armDistance = 80;
	var armPosY = 150;
	this.leftArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.leftPawMiddle = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPawMiddle.position.z = armRadius;
	this.leftPawMiddle.position.y = armLegth-55;
	this.leftPawMiddle.rotation.x = -Math.PI / 2;
	this.leftPaw1 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw1.position.z = armRadius;
	this.leftPaw1.position.y = armLegth-40;
	this.leftPaw1.rotation.x = -Math.PI / 2;
	this.leftPaw1.scale.set(0.7, 0.7, 0.7);
	this.leftPaw2 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw2.position.z = armRadius;
	this.leftPaw2.position.y = armLegth-42;
	this.leftPaw2.rotation.x = -Math.PI / 2;
	this.leftPaw2.position.x = 9;
	this.leftPaw2.scale.set(0.7, 0.7, 0.7);
	this.leftPaw3 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw3.position.z = armRadius;
	this.leftPaw3.position.y = armLegth-42;
	this.leftPaw3.rotation.x = -Math.PI / 2;
	this.leftPaw3.position.x = -9;
	this.leftPaw3.scale.set(0.7, 0.7, 0.7);

	// right arm
	this.rightArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.rightPawMiddle = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPawMiddle.position.z = armRadius;
	this.rightPawMiddle.position.y = armLegth-55;
	this.rightPawMiddle.rotation.x = -Math.PI / 2;
	this.rightPaw1 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw1.position.z = armRadius;
	this.rightPaw1.position.y = armLegth-40;
	this.rightPaw1.rotation.x = -Math.PI / 2;
	this.rightPaw1.scale.set(0.7, 0.7, 0.7);
	this.rightPaw2 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw2.position.z = armRadius;
	this.rightPaw2.position.y = armLegth-42;
	this.rightPaw2.rotation.x = -Math.PI / 2;
	this.rightPaw2.position.x = 9;
	this.rightPaw2.scale.set(0.7, 0.7, 0.7);
	this.rightPaw3 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw3.position.z = armRadius;
	this.rightPaw3.position.y = armLegth-42;
	this.rightPaw3.rotation.x = -Math.PI / 2;
	this.rightPaw3.position.x = -9;
	this.rightPaw3.scale.set(0.7, 0.7, 0.7);

	// face
	var facePosZ = 40;
	this.face = new THREE.Mesh(faceGeom, this.brownMaterial);
	this.face.position.z = facePosZ;
	this.face.rotation.x = -Math.PI / 2;

	// eyes
	var eyeDistance = 28;
	this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.leftEye.position.x = eyeDistance;
	this.leftEye.position.z = facePosZ + 35;
	this.leftEye.position.y = 25;
	this.leftEye.rotation.x = -Math.PI / 2;

	this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.rightEye.position.x = -eyeDistance;
	this.rightEye.position.z = facePosZ + 35;
	this.rightEye.position.y = 25;
	this.rightEye.rotation.x = -Math.PI / 2;

	// iris
	this.leftIris = new THREE.Mesh(irisGeom, this.blackMaterial);
	this.leftIris.position.x = eyeDistance;
	this.leftIris.position.z = facePosZ + 35 + 2;
	this.leftIris.position.y = 25;
	this.leftIris.rotation.x = -Math.PI / 2;

	this.rightIris = new THREE.Mesh(irisGeom, this.blackMaterial);
	this.rightIris.position.x = -eyeDistance;
	this.rightIris.position.z = facePosZ + 35 + 2;
	this.rightIris.position.y = 25;
	this.rightIris.rotation.x = -Math.PI / 2;

	// nose
	var noseTopPosition = 5;
	this.nose = new THREE.Mesh(noseGeom, this.blackMaterial);
	this.nose.position.x = 0;
	this.nose.position.z = facePosZ + 35;
	this.nose.position.y = -noseTopPosition;
	this.nose.rotation.x = -Math.PI / 2;

	// mouth top
	this.mouthTop = new THREE.Mesh(mouthTopGeom, this.blackMaterial);
	this.mouthTop.position.z = facePosZ + 35;
	this.mouthTop.position.y = -noseTopPosition - 13;
	this.mouthTop.position.x = 0;

	// mouth left side
	this.mouthLeft = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthLeft.position.z = facePosZ + 35;
	this.mouthLeft.position.y = -noseTopPosition - 20;
	this.mouthLeft.position.x = -12;
	this.mouthLeft.rotation.z = Math.PI;
	this.mouthLeft.rotation.y = -Math.PI;

	// mouth right side
	this.mouthRight = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthRight.position.z = facePosZ + 35;
	this.mouthRight.position.y = -noseTopPosition - 20;
	this.mouthRight.position.x = 12;
	this.mouthRight.rotation.z = Math.PI;

	// ears
	var earPostionZ = facePosZ;
	this.rightEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.rightEar.position.x = -50;
	this.rightEar.position.y = 50;
	this.rightEar.position.z = earPostionZ;
	this.rightEar.rotation.x = -Math.PI / 2;

	this.rightEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.rightEarInner.position.x = -50;
	this.rightEarInner.position.y = 50;
	this.rightEarInner.position.z = earPostionZ + 2;
	this.rightEarInner.rotation.x = -Math.PI / 2;

	this.leftEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.leftEar.position.x = 50;
	this.leftEar.position.y = 50;
	this.leftEar.position.z = earPostionZ;
	this.leftEar.rotation.x = -Math.PI / 2;

	this.leftEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.leftEarInner.position.x = 50;
	this.leftEarInner.position.y = 50;
	this.leftEarInner.position.z = earPostionZ + 2;
	this.leftEarInner.rotation.x = -Math.PI / 2;

	// Create head group
	this.headGroup = new THREE.Group();
	this.headGroup.add(this.face);
	this.headGroup.add(this.rightEar);
	this.headGroup.add(this.leftEar);
	this.headGroup.add(this.rightEarInner);
	this.headGroup.add(this.leftEarInner);
	this.headGroup.add(this.nose);
	this.headGroup.add(this.leftEye);
	this.headGroup.add(this.rightEye);
	this.headGroup.add(this.leftIris);
	this.headGroup.add(this.rightIris);
	this.headGroup.add(this.mouthTop);
	this.headGroup.add(this.mouthLeft);
	this.headGroup.add(this.mouthRight);
	this.headGroup.applyMatrix(new THREE.Matrix4().makeTranslation(0, 210, 0));
	
	// Create left arm Group
	this.leftArmGroup = new THREE.Group();
	this.leftArmGroup.add(this.leftArm);
	this.leftArmGroup.add(this.leftPawMiddle);
	this.leftArmGroup.add(this.leftPaw1);
	this.leftArmGroup.add(this.leftPaw2);
	this.leftArmGroup.add(this.leftPaw3);
	this.leftArmGroup.position.x = -armDistance;
	this.leftArmGroup.position.z = bodyPosZ + 30;
	this.leftArmGroup.position.y = armPosY;
	
	// Create left arm Group
	this.rightArmGroup = new THREE.Group();
	this.rightArmGroup.add(this.rightArm);
	this.rightArmGroup.add(this.rightPawMiddle);
	this.rightArmGroup.add(this.rightPaw1);
	this.rightArmGroup.add(this.rightPaw2);
	this.rightArmGroup.add(this.rightPaw3);
	this.rightArmGroup.position.x = armDistance;
	this.rightArmGroup.position.z = bodyPosZ + 30;
	this.rightArmGroup.position.y = armPosY;

	// Create body group
	this.bodyGroup = new THREE.Group();
	this.bodyGroup.add(this.body);
	this.bodyGroup.add(this.leftArmGroup);
	this.bodyGroup.add(this.rightArmGroup);
	this.bodyGroup.add(this.leftLeg);
	this.bodyGroup.add(this.leftLegClaw1);
	this.bodyGroup.add(this.leftLegClaw2);
	this.bodyGroup.add(this.leftLegClaw3);
	this.bodyGroup.add(this.rightLeg);
	this.bodyGroup.add(this.rightLegClaw1);
	this.bodyGroup.add(this.rightLegClaw2);
	this.bodyGroup.add(this.rightLegClaw3);

	// Create all group
	this.allGroup = new THREE.Group();
	this.allGroup.add(this.headGroup);
	this.allGroup.add(this.bodyGroup);
	this.allGroup.traverse(function(object) {
		if (object instanceof THREE.Mesh) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	});
	this.rightIris.castShadow = false;
	this.rightIris.receiveShadow = false;
	this.leftIris.castShadow = false;
	this.leftIris.receiveShadow = false;
}

Teddy.prototype.move = function(xTarget, yTarget, xTargetMaxAbs, yTargetMaxAbs) {

	this.tHeagRotY = calculateRotation(xTarget, -yTargetMaxAbs, yTargetMaxAbs, -Math.PI / 3, Math.PI / 3);
	this.tHeadRotX = calculateRotation(yTarget, -xTargetMaxAbs, xTargetMaxAbs, -Math.PI / 4, Math.PI / 4);

	this.tHeadPosX = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, 10, -10);
	this.tHeadPosY = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, 220, 240);
	this.tHeadPosZ = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, -30, 30);

	var irisScaleFactor = 2.5 - Math.max(1.0, Math.min(1.5, Math.pow(xTarget * xTarget + yTarget * yTarget, 0.5) / 40.0 + 0.5));
	this.leftIris.scale.set(irisScaleFactor, 1, irisScaleFactor);
	this.rightIris.scale.set(irisScaleFactor, 1, irisScaleFactor);

	this.tArmRotationRight = -calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 4, Math.PI);
	this.tArmRotationLeft = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 4, Math.PI);

	this.tBodyRotZ = calculateRotation(xTarget, -200, 200, -Math.PI / 8, Math.PI / 8);
	this.tBodyRotX = calculateRotation(yTarget, -200, 200, -Math.PI / 8, Math.PI / 8);

	this.updateNextStep(40);
}

Teddy.prototype.updateNextStep = function(step) {

	this.headGroup.rotation.y += (this.tHeagRotY - this.headGroup.rotation.y) / step;
	this.headGroup.rotation.x += (this.tHeadRotX - this.headGroup.rotation.x) / step;
	this.headGroup.position.x += (this.tHeadPosX - this.headGroup.position.x) / step;
	this.headGroup.position.y += (this.tHeadPosY - this.headGroup.position.y) / step;
	this.headGroup.position.z += (this.tHeadPosZ - this.headGroup.position.z) / step;

	this.leftArmGroup.rotation.z += (this.tArmRotationLeft - this.leftArmGroup.rotation.z) / step;
	this.rightArmGroup.rotation.z += (this.tArmRotationRight - this.rightArmGroup.rotation.z) / step;

	this.body.rotation.x += (this.tBodyRotX - this.body.rotation.x) / step;
	this.bodyGroup.rotation.z += (this.tBodyRotZ - this.bodyGroup.rotation.z) / step;
}

/**
 * Helper to calculate rotation angle from detector position
 */
function calculateRotation(v, vmin, vmax, minAngle, maxAngle) {
	var value = Math.max(Math.min(v, vmax), vmin);
	var deltaValue = vmax - vmin;
	var fraction = (value - vmin) / deltaValue;
	var deltaAngle = maxAngle - minAngle;
	var result = minAngle + (fraction * deltaAngle);
	return result;
}
