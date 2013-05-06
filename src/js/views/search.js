
(function() {


   function Search(element, clientId) {
      this.element = element;
      this._clientId = clientId;

      element.querySelector('.search').addEventListener('change', this._handleSearch.bind(this));
      element.querySelector('.results-container').addEventListener('click', this._handleResultClick.bind(this));
   }


   Search.prototype = Object.create(Subscribable.prototype);


   Search.prototype._handleResultClick = function(evt) {

      var streamUrl = evt.target.href;

      if (streamUrl) {
         evt.preventDefault();

         this.fire('selected', evt.target.innerText, streamUrl + '?client_id=' + this._clientId);
      }

   };

   Search.prototype._handleSearch = function(evt) {

      var query = encodeURIComponent(evt.target.value),
          xhr = new XMLHttpRequest();

      this._renderResults({ searching: true });

      xhr.open('GET', 
         'http://api.soundcloud.com/tracks.json?q=' + query + '&client_id=' + this._clientId, true);

      xhr.onreadystatechange = (function() {
         if (xhr.readyState === 4) {
            if (xhr.status === 200) {
               this._renderResults({ results: JSON.parse(xhr.responseText)});
            } else {
               this._renderResults({ error: 'Could not retrieve any results at this time.' });
            }
         }
      }).bind(this);

      xhr.send();

   };

   Search.prototype._renderResults = function(data) {

      var resultsContainer = this.element.querySelector('.results-container');

      data.searching = data.searching !== undefined ? data.searching : false;
      data.error = data.error || '';
      data.results = data.results || [];

      resultsContainer.innerHTML = '';
      resultsContainer.appendChild(blueprints('search-results', data));

   };
   

   window.Search = Search;


}());
