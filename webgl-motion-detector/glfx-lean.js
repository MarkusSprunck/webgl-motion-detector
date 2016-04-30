/*
 * This class is based on glfx.js
 */

/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = (function() {
	
	var exports = {};

	// src/core/canvas.js
	var gl;

	function wrapTexture(texture) {
		return {
			_ : texture,
			loadContentsOf : function(element) {
				// Make sure that we're using the correct global WebGL context
				gl = this._.gl;
				this._.loadContentsOf(element);
			}
		};
	}

	function texture(element) {
		return wrapTexture(Texture.fromElement(element));
	}

	function initialize(width, height) {
		var type = gl.UNSIGNED_BYTE;
		this.width = width;
		this.height = height;
		this._.texture = new Texture(width, height, gl.RGBA, type);
		this._.spareTexture = new Texture(width, height, gl.RGBA, type);
		this._.flippedShader = this._.flippedShader
				|| new Shader(
						null,
						'\
				        uniform sampler2D texture;\
				        varying vec2 texCoord;\
				        void main() {\
				            gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));\
				        }\
					');
		this._.isInitialized = true;
	}

	/*
	 * Draw a texture to the canvas, with an optional width and height to scale
	 * to. If no width and height are given then the original texture width and
	 * height are used.
	 */
	function draw(texture, width, height) {
		if (!this._.isInitialized || texture._.width != this.width || texture._.height != this.height) {
			initialize.call(this, width ? width : texture._.width, height ? height : texture._.height);
		}

		texture._.use();
		this._.texture.drawTo(function() {
			Shader.getDefaultShader().drawRect();
		});

		return this;
	}

	function update() {
		this._.texture.use();
		this._.flippedShader.drawRect();
		return this;
	}

	function simpleShader(shader, uniforms, textureIn, textureOut) {
		(textureIn || this._.texture).use();
		this._.spareTexture.drawTo(function() {
			shader.uniforms(uniforms).drawRect();
		});
		this._.spareTexture.swapWith(textureOut || this._.texture);
	}

	function wrap(func) {
		return function() {
			// Make sure that we're using the correct global WebGL context
			gl = this._.gl;

			// Now that the context has been switched, we can call the wrapped
			// function
			return func.apply(this, arguments);
		};
	}

	exports.canvas = function() {
		var canvas = document.createElement('canvas');
		gl = canvas.getContext('experimental-webgl', {
			premultipliedAlpha : false
		});
		
		canvas._ = {
			gl : gl,
			isInitialized : false,
			texture : null,
			spareTexture : null,
			flippedShader : null
		};

		// Methods
		canvas.texture = wrap(texture);
		canvas.draw = wrap(draw);
		canvas.update = wrap(update);
		canvas.move = wrap(move);
		canvas.mirror = wrap(mirror);
		return canvas;
	};
	
	function mirror() {
		gl.mirror = gl.mirror
				|| new Shader(
						null,
						' \
				        uniform sampler2D texture; \
				        uniform float brightness; \
				        varying vec2 texCoord; \
				        void main() { \
				            vec4 color = texture2D(texture, vec2(1.0 - texCoord.x,texCoord.y)); \
				            gl_FragColor = color; \
				        } \
				    ');

		simpleShader.call(this, gl.mirror, {});
		return this;
	}

	function move() {
		gl.move = gl.move
				|| new Shader(
						null,
						' \
				        uniform sampler2D texture; \
				        uniform float brightness; \
				        varying vec2 texCoord; \
				        void main() { \
				            vec4 color = texture2D(texture, texCoord); \
				            if (texCoord.y < 0.5) { \
				                vec4 color2 = texture2D(texture, vec2(texCoord.x, texCoord.y + 0.5)); \
				                float d = abs(color2.r - color.r) +  abs(color2.g - color.g) +  abs(color2.b - color.b); \
				                d = d * 1.5; \
				                color = vec4(d,d,d,1.0); \
				                if (d < 0.5) { \
				                    color = vec4(0.0,0.0,0.0,1.0); \
				                } \
				            } \
				            gl_FragColor = color; \
				        }\
				    ');
		
		simpleShader.call(this, gl.move, {});
		return this;
	}

	var Shader = (function() {

		function compileSource(type, source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			return shader;
		}

		var defaultVertexSource = '\
								    attribute vec2 vertex;\
								    attribute vec2 _texCoord;\
								    varying vec2 texCoord;\
								    void main() {\
								        texCoord = _texCoord;\
								        gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
								    }';

		var defaultFragmentSource = '\
								    uniform sampler2D texture;\
								    varying vec2 texCoord;\
								    void main() {\
								        gl_FragColor = texture2D(texture, texCoord);\
								    }';

		function Shader(vertexSource, fragmentSource) {
			this.vertexAttribute = null;
			this.texCoordAttribute = null;
			this.program = gl.createProgram();
			vertexSource = vertexSource || defaultVertexSource;
			fragmentSource = fragmentSource || defaultFragmentSource;
			fragmentSource = 'precision lowp float;' + fragmentSource; 
			gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
			gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
			gl.linkProgram(this.program);
		}

		Shader.prototype.uniforms = function(uniforms) {
			gl.useProgram(this.program);
			return this;
		};
	
		Shader.prototype.drawRect = function(left, top, right, bottom) {
			var undefined;
			var viewport = gl.getParameter(gl.VIEWPORT);
			top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
			left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
			right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
			bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
			if (gl.vertexBuffer == null) {
				gl.vertexBuffer = gl.createBuffer();
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ left, top, left, bottom, right, top, right, bottom ]), gl.STATIC_DRAW);
			if (gl.texCoordBuffer == null) {
				gl.texCoordBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), gl.STATIC_DRAW);
			}
			if (this.vertexAttribute == null) {
				this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
				gl.enableVertexAttribArray(this.vertexAttribute);
			}
			if (this.texCoordAttribute == null) {
				this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
				gl.enableVertexAttribArray(this.texCoordAttribute);
			}
			gl.useProgram(this.program);
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
			gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
			gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		};

		Shader.getDefaultShader = function() {
			gl.defaultShader = gl.defaultShader || new Shader();
			return gl.defaultShader;
		};

		return Shader;
	})();

	var Texture = (function() {
		Texture.fromElement = function(element) {
			var texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
			texture.loadContentsOf(element);
			return texture;
		};

		function Texture(width, height, format, type) {
			this.gl = gl;
			this.id = gl.createTexture();
			this.width = width;
			this.height = height;
			this.format = format;
			this.type = type;

			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			if (width && height)
				gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
		}

		Texture.prototype.loadContentsOf = function(element) {
			this.width = element.width || element.videoWidth;
			this.height = element.height || element.videoHeight;
			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, element);
		};

		Texture.prototype.use = function(unit) {
			gl.activeTexture(gl.TEXTURE0 + (unit || 0));
			gl.bindTexture(gl.TEXTURE_2D, this.id);
		};

		Texture.prototype.drawTo = function(callback) {
			// start rendering to this texture
			gl.framebuffer = gl.framebuffer || gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
			gl.viewport(0, 0, this.width, this.height);

			// do the drawing
			callback();

			// stop rendering to this texture
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		};
	
		Texture.prototype.swapWith = function(other) {
			var temp;
			temp = other.id;
			other.id = this.id;
			this.id = temp;
			temp = other.width;
			other.width = this.width;
			this.width = temp;
			temp = other.height;
			other.height = this.height;
			this.height = temp;
			temp = other.format;
			other.format = this.format;
			this.format = temp;
		};

		return Texture;
	})();
	
	return exports;
})();
