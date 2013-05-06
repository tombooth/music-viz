(function(doc) {

var ce="createElement",
ct="createTextNode",
ac="appendChild",
sa="setAttribute",
cf="createDocumentFragment";

function blueprints(id, data) {
	return blueprints._s[id](data, blueprints);
}

blueprints._s = { };
blueprints._s["now-playing"] = function(data) {
	var fragment = doc[cf]();
	with (data||{}){
	var elem0 = doc[ce]("div");
	elem0[sa]("class", "now-playing");
	fragment[ac](elem0);
	
	var elem2 = doc[ce]("div");
	elem2[sa]("class", "title");
	elem0[ac](elem2);
	elem2[ac](doc[ct]("No track loaded."));
	
	var elem5 = doc[ce]("div");
	elem5[sa]("class", "progress");
	elem0[ac](elem5);
	
	var elem7 = doc[ce]("div");
	elem7[sa]("class", "loading");
	elem5[ac](elem7);
	
	var elem9 = doc[ce]("div");
	elem9[sa]("class", "playing");
	elem5[ac](elem9);
	
	
		}
	return fragment;
};


blueprints._s["search-results"] = function(data) {
	var fragment = doc[cf]();
	with (data||{}){
	var elem0 = doc[ce]("ul");
	elem0[sa]("class", "search-results");
	fragment[ac](elem0);
	if (searching) {
	var elem2 = doc[ce]("li");
	elem0[ac](elem2);
	elem2[ac](doc[ct]("Searching for tracks..."));
	} else if (error) {
	var elem5 = doc[ce]("li");
	elem0[ac](elem5);
	elem5[ac](doc[ct](error));
	elem0[ac](doc[ct](" ##} else if (!results || result.length === 0) { "));
	var elem8 = doc[ce]("li");
	elem0[ac](elem8);
	elem8[ac](doc[ct]("Found no tracks for this query."));
	} else {
	results.forEach(function(result) {
	var elem11 = doc[ce]("li");
	elem0[ac](elem11);
	var elem12 = doc[ce]("a");
	var elem12_attr0 = "";
	elem12_attr0 += "";
	elem12_attr0 += result.stream_url;
	elem12_attr0 += "";
	elem12[sa]("href", elem12_attr0);
	elem11[ac](elem12);
	elem12[ac](doc[ct](result.title));
	});
	}
		}
	return fragment;
};


blueprints._s["search"] = function(data) {
	var fragment = doc[cf]();
	with (data||{}){
	var elem0 = doc[ce]("div");
	elem0[sa]("class", "search-container");
	fragment[ac](elem0);
	
	var elem2 = doc[ce]("input");
	elem2[sa]("type", "text");
	elem2[sa]("role", "search");
	elem2[sa]("class", "search");
	elem2[sa]("placeholder", "Search SoundCloud...");
	elem0[ac](elem2);
	
	var elem4 = doc[ce]("div");
	elem4[sa]("class", "results-container");
	elem0[ac](elem4);
	
		}
	return fragment;
};


blueprints._s["structure"] = function(data) {
	var fragment = doc[cf]();
	with (data||{}){
	var elem0 = doc[ce]("h1");
	elem0[sa]("class", "status hidden");
	fragment[ac](elem0);
	
	var elem2 = doc[ce]("div");
	elem2[sa]("class", "settings");
	fragment[ac](elem2);
	
	var elem4 = doc[ce]("div");
	elem4[sa]("class", "music");
	elem4[sa]("data-title", "Music");
	elem2[ac](elem4);
	elem4[ac](blueprints('now-playing'));
	elem4[ac](blueprints('search'));
	
		}
	return fragment;
};
window.blueprints = blueprints;
})(document);