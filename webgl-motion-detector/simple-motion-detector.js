/**
 * Copyright (C) 2013-2016, Markus Sprunck
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
 * 
 * SimpleMotionDetector:
 * 
 * Captures the video signal and compares single frames to 
 * detect motion. The center of this motion is used to find 
 * the viewpoint of the user. With this viewpoint the g_camera 
 * position will be rotated. 
 *
 */
function SimpleMotionDetector( object ) {
	
		// number of pixels for analysis
		var PIXELS_HORIZONTAL = 16 * 4; 
		var PIXELS_VERTICAL   = 10 * 4; 
		
		// size of info window
		var WIDTH =  16 * 19 ; 
		var HEIGHT = 10 * 19 ; 
	
		// expected to be THREE.g_camera object
		this.object = object;	
		
		// amplification factor for rotation (one is almost natural)
		this.amplificationAlpha = 0.25;
		this.amplificationGamma = 0.25;	
		
		// in degrees
		this.offsetAlpha = -35.0;		
		this.offsetGamma = -12.0;
		
		// just the upper part of the video should be detected
		this.detectionBorder = 0.85;
		
		// threshold of detected pixels
		this.pixelThreshold = 128;
		
		// average of all x positions of detected motion 
		this.averageX = new MovingAverager( 250 );
		this.averageX.setValue( WIDTH / 2 );
		
		// average of all y positions of detected motion 
		this.averageY = new MovingAverager( 250 );
		this.averageY.setValue( HEIGHT / 2 );		
		
		// show canvas
		this.showCanvas = true;
		
		this.isVideoRunning = false;
		
		this.stop = false;
			
		this.videoCanvas = document.createElement( 'canvas' );
		this.videoCanvas.width = PIXELS_HORIZONTAL;
		this.videoCanvas.height = PIXELS_VERTICAL;

		var canvas = document.createElement( 'canvas' );
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.position = 'absolute';
		canvas.style.right = '10px';
		canvas.style.bottom = '10px';
		canvas.style.opacity = 0.6;
		canvas.hidden = !this.showCanvas;
		canvas.id="video_canvas";
		
		var videoContext = this.videoCanvas.getContext( '2d' );
		var APP = {};
		var simpleMotionDetector;
		var texture = null;
		var ctx = canvas.getContext( '2d' );
		var video;
		this.stream;
		document.body.appendChild( canvas );	
		
		SimpleMotionDetector.prototype.init = function() {	
			
			simpleMotionDetector = this;
		
			navigator.getUserMedia = navigator.mozGetUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia 
								  || navigator.msGetUserMedia;
					
			var _that = this;
			video = document.createElement( 'video' );
			if ( navigator.getUserMedia ) { 
	 			navigator.getUserMedia( {audio: false, video: true}, 
					function( stream ) {
	 					_that.stream = stream;
	 				    video.src = window.URL.createObjectURL( stream );
						APP.videoWidth = PIXELS_HORIZONTAL;
						APP.videoHeight = PIXELS_VERTICAL;  
						APP.frontCanvas = document.createElement( 'canvas' );
						APP.frontCanvas.width = APP.videoWidth;
						APP.frontCanvas.height = APP.videoHeight * 2;
						APP.ctx = APP.frontCanvas.getContext( '2d' );
						APP.comp = [];
						simpleMotionDetector.run( );
					}, 
					function( e ) {
					}
				);
			} else {
				$("#error-message").text("Your browser does not seem to support UserMedia (video).");
			}
		}
		
		
		SimpleMotionDetector.prototype.analyisMotionPicture = function() {			
 			videoContext.drawImage( canvas, 0, 0 );
 			var data = videoContext.getImageData( 0, 0, PIXELS_HORIZONTAL, PIXELS_VERTICAL ).data;

 			ctx.fillStyle = '#FFFFFF';
 			ctx.fillRect( 0,0, WIDTH, HEIGHT );
 			ctx.globalAlpha = 0.2;	

 			var cubeWidth = WIDTH / PIXELS_HORIZONTAL - 1 | 0;
			var cubeHeight = HEIGHT / PIXELS_VERTICAL - 1 | 0;
			
			var yTopPosition = Number.MAX_VALUE;
			for ( var y = 0; y < PIXELS_VERTICAL-1; y++ ) {
				for ( var x = 0; x < PIXELS_HORIZONTAL; x++ ) {
					if ( data[x * 4 + y * PIXELS_HORIZONTAL * 4] > this.pixelThreshold ) {
						var xPos = x * WIDTH / PIXELS_HORIZONTAL;
						var yPos = y * HEIGHT / PIXELS_VERTICAL;						
						if ( y < PIXELS_VERTICAL * this.detectionBorder ) {
							if ( yTopPosition >= Math.min( yTopPosition, yPos ) ) {
								yTopPosition = yPos;
								this.averageX.setValue( xPos );
								this.averageY.setValue( yPos );							
								ctx.fillStyle = '#000000';
								ctx.fillRect( xPos, yPos, cubeWidth , cubeHeight );
							}
							ctx.fillStyle = '#0000FF';
							ctx.fillRect( xPos, yPos, cubeWidth , cubeHeight );		
						} else {
							ctx.fillStyle = '#00FF00';
							ctx.fillRect( xPos, yPos, cubeWidth , cubeHeight );		
						}			
					}
				}		
			}
	
			// print red cross
			ctx.fillStyle = '#FF0000';
			ctx.fillRect( simpleMotionDetector.averageX.getValue( ) - cubeWidth*0.5, simpleMotionDetector.averageY.getValue( ), cubeWidth*1.5 , cubeHeight*0.5 );
			ctx.fillRect( simpleMotionDetector.averageX.getValue( ), simpleMotionDetector.averageY.getValue( ) - cubeHeight*0.5, cubeWidth*0.5 , cubeHeight*1.5 );		
		}
		
		SimpleMotionDetector.prototype.terminate = function() {	
			var stream = this.stream;
			if (typeof stream !== "undefined" ){
				var track = stream.getTracks()[0];  
				track.stop();
			}
		}
			
		SimpleMotionDetector.prototype.analyseVideo = function() {			
			videoContext.drawImage( video,0,0, PIXELS_HORIZONTAL, PIXELS_VERTICAL );
			APP.ctx.drawImage( this.videoCanvas, 0, 0 );
			texture.loadContentsOf( APP.frontCanvas );
			canvas.draw( texture );
			canvas.mirror( );
			canvas.move( );
			canvas.update( );
  			APP.ctx.drawImage( this.videoCanvas, 0, PIXELS_VERTICAL );  		
			simpleMotionDetector.analyisMotionPicture( );
			
			var _that = this;
			if (!this.stop)  {
				setTimeout(function(){ _that.analyseVideo(); }, 20);
			}
			this.isVideoRunning = true;
		}
	
		SimpleMotionDetector.prototype.run = function() {
  			canvas = fx.canvas( );
  			texture = canvas.texture( APP.frontCanvas );
  			video.play( );
  			this.analyseVideo( ); 
		}		
		
		SimpleMotionDetector.prototype.domElement = canvas;
  }