/*
	Replace \[(.+)\]
	with \{\"name\"\:\"\1\",
*/
/*
var entries = [{
	"name" : " ",
	"url" : " ",
	"locations": [
		{"loc":"","country":"IN"},
		{"loc":"","country":"US"}
	]
	"remote" : true;
},
{
	
}]
*/

function generateOptionsMenu(){
	var r = new XMLHttpRequest();
	r.open("GET","/",true);
	r.responseType = "json"
	r.send();

	var entries;

	var z = window.setTimeout(function(){
		//console.log("ASD");
		entries = r.response.data;
		fx();
	},5000);

	var countryMap = new Map;

	function fx(){

		for(var i = 0; i < entries.length; i++){
			let locEntry = entries[i].locations;
			if(!locEntry){
				continue;
			}
			for(var j = 0; j < locEntry.length; j++){
				let country = locEntry[j].country;
				let loc = locEntry[j].loc;
				
				if(!loc && !country){
					continue;
				}
				
				if(!country){
					country = "World";
				}
				
				if(!loc){
					loc = "Unknown";
				}
				
				loc = loc.toLowerCase();
				loc = loc.replace(/\s|\,|\'/g,"");
				
				let mapEntry = countryMap.get(country);
				
				if(mapEntry){
					if(mapEntry.has(loc)){
						continue;
					} else{
						mapEntry.add(loc);
					}
				}
				else{
					countryMap.set(country, new Set([loc]));
					//countryMap.get(country).add(loc);
				}
			}
		}
	}
}