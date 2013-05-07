
(function() {


   function DomainViz(analyserNode) {

      var width = window.innerWidth - 50,
          height = window.innerHeight - 50;

      this._analyserNode = analyserNode;
      this._running = false;

      this._camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
      this._camera.position.x = 512;
      this._camera.position.y = 500;
      this._camera.position.z = 400;

      this._camera.lookAt( new THREE.Vector3( 512, 0, -500) );

      this._renderer = new THREE.WebGLRenderer();
      this._renderer.setSize( width, height );

      document.body.appendChild( this._renderer.domElement );

   }


   DomainViz.prototype.start = function() {

      this._running = true;

      this._all_scene = new THREE.Scene();
      this._freq_scene = new THREE.Scene();
      this._time_scene = new THREE.Scene();

      this._all_scene.add(this._freq_scene);
      this._all_scene.add(this._time_scene);

      this._render();

   };

   DomainViz.prototype.stop = function() {

      this._running = false;
      this._renderer.clear();

   };

   DomainViz.prototype._render = function() {

      var freqBuffer, timeBuffer;

      if (this._running) requestAnimationFrame( this._render.bind(this) );

      freqBuffer = new Uint8Array(this._analyserNode.frequencyBinCount);
      timeBuffer = new Uint8Array(this._analyserNode.frequencyBinCount);

      this._analyserNode.getByteFrequencyData(freqBuffer);
      this._analyserNode.getByteTimeDomainData(timeBuffer);

      this._renderBuffer(this._freq_scene, freqBuffer, 0x000000);
      this._renderBuffer(this._time_scene, timeBuffer, 0xFF0000);

      this._renderer.render( this._all_scene, this._camera );

   };

   DomainViz.prototype._renderBuffer = function(scene, buffer, color) {

      var geometry = new THREE.Geometry();

      if (scene.children.length === 100) {
         scene.remove(scene.children[0]);
      }

      for (var i = 0; i < scene.children.length; i++) {
         scene.children[i].translateZ(-10);
      }

      for (var i = 0; i < buffer.length; i++) {
         geometry.vertices.push( new THREE.Vector3( i , buffer[i], 0 ) );
      }

      scene.add( new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: color })) );

   };


   window.DomainViz = DomainViz;


}());
