
(function() {

   "use strict";

   var clientId = 'a68782f824e72d49f29bb6e06b4bf29c';

   document.body.appendChild(blueprints("structure"));

   var settings = new Tweaker(document.querySelector('.settings')),
       context = new webkitAudioContext(),
       analyserNode = context.createAnalyser(),
       nowPlaying = new NowPlaying(document.querySelector('.now-playing'), context),
       search = new Search(document.querySelector('.search-container'), clientId),
       domainViz = new DomainViz(analyserNode);

   analyserNode.connect(context.destination);

   function handleSelected(title, url) {
      document.querySelector('.status').classList.remove('hidden');
      document.querySelector('.status').innerText = 'Downloading...';
      nowPlaying.openTrack(title, url);
   }

   search.on('selected', handleSelected);

   nowPlaying.on('downloaded', function() {
      document.querySelector('.status').innerText = 'Decoding...';
   });

   nowPlaying.on('decoded', function(source) {
      document.querySelector('.status').classList.add('hidden');

      source.connect(analyserNode);

      nowPlaying.play();
   });

   nowPlaying.on('playing', function(source) {
      console.log('track started');
      domainViz.start();
   });

   nowPlaying.on('stopped', function(source) {
      console.log('track finished');
      domainViz.stop();
      source.disconnect();
   });

   handleSelected('The XX - Together', 'http://api.soundcloud.com/tracks/89234832/stream?client_id=a68782f824e72d49f29bb6e06b4bf29c');

}());
