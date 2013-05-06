
(function() {


   function NowPlaying(element, context) {
      this.element = element;
      this._context = context;
   }

   NowPlaying.prototype = Object.create(Subscribable.prototype);


   NowPlaying.prototype.openTrack = function(title, url) {

      var request = new XMLHttpRequest();

      this._clear();

      this.element.querySelector('.title').innerText = title;

      this._currentTrack = {
         title: title,
         url: url,
         request: request
      };

      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      request.addEventListener('progress', (function(evt) {

         if (evt.lengthComputable) {
            this.element.querySelector('.progress .loading').style.width = (evt.loaded / evt.total * 100) + '%';
         }

      }).bind(this));

      request.addEventListener('load', (function() {

         this.fire('downloaded');

         this._context.decodeAudioData(
            request.response,
            this._handleDecoded.bind(this, this._currentTrack),
            this._handleError.bind(this)
         );

      }).bind(this));

      request.send();

   };

   NowPlaying.prototype.play = function() {

      var startTime = this._context.currentTime,
          timingFunction = setInterval(this._handleTiming.bind(this), 1000);

      this._currentTrack.timingFunction = timingFunction;
      this._currentTrack.startTime = startTime;

      this._currentTrack.source.noteOn(startTime);

      this.fire('playing', this._currentTrack.source);

   };

   NowPlaying.prototype._clear = function() {

      var track = this._currentTrack;

      this.element.querySelector('.loading').style.width = '0%';
      this.element.querySelector('.playing').style.width = '0%';

      if (track) {
         clearInterval(track.timingFunction);

         if (track.request.readyState !== 4) {
            track.request.abort();
         }

         if (track.source && track.source.playbackState === 2) {
            track.source.stop(0);
            this.fire('stopped', track.source);
         }

         track.aborted = true;
      }

   };

   NowPlaying.prototype._handleTiming = function() {

      var track = this._currentTrack,
          source = track.source,
          percent;

      if (source.playbackState === 2) {
         percent = (this._context.currentTime - track.startTime) / track.duration * 100;
      } else if (source.playbackState === 3) {
         percent = 100;
         clearInterval(track.timingFunction);
         this.fire('stopped', source);
      }

      this.element.querySelector('.playing').style.width = percent + '%';

   };

   NowPlaying.prototype._handleDecoded = function(track, audioBuffer) {

      var source = this._context.createBufferSource();

      // track could have been aborted and cleared in the middle of decoding
      if (track.aborted) return;

      source.buffer = audioBuffer;

      this._currentTrack.duration = audioBuffer.duration;
      this._currentTrack.source = source;

      this.fire('decoded', source);

   };

   NowPlaying.prototype._handleError = function() { 

      this.fire.apply(this, [ 'error' ].concat(arguments));

   };
   

   window.NowPlaying = NowPlaying;


}());
