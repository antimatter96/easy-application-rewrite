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


	r.onreadystatechange = function(){
	if(r.readyState == 4){
		//init2();
		entries = r.response.data;
		fx();
		}
	}

	var countryMap = new Map;
	var countryArr;
	
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
				let z = { "l" : loc,"full":locEntry[j].loc};
				let x = JSON.stringify(z);
			
				if(mapEntry){
					if(mapEntry.has(x)){
						continue;
					} else{
						mapEntry.add(x);
					}
				}
				else{
					countryMap.set(country, new Set([x]));
					//countryMap.get(country).add(loc);
				}
			}
		}
		
		countryArr = [];
		
		let countryIter = countryMap.entries();
	
		let country = countryIter.next();
		while(!country.done){
			countryArr.push(country.value);
			country = countryIter.next();
		}
		
		countryArr = countryArr.sort(function(a , b){
			//console.log(a,b);
			//console.log(a[1].size,b[1].size);
			if( a[1].size > b[1].size ){
				return -1;
			}
			else if( a[1].size < b[1].size ){
				return 1;
			}
			else{
				return a[0] > b[0];
			}
		});
		
		console.log(countryArr);
		
		document.body.removeChild(document.body.firstElementChild);
		
		var sel = document.createElement('select');
		
		var countryArrMain = [];
		for( var i = 0; i < countryArr.length; i++){
			let temp = {};
			temp["c"] =  countryArr[i][0];
			
			let arr = new Array(...countryArr[i][1]);
			arr = arr.sort();
			
			temp["l"] = arr;
			countryArrMain[i] = temp;
		}
		
		for( var i = 0; i < countryArrMain.length; i++){
			let optGrp = document.createElement('optgroup');
			optGrp.label = countryArrMain[i]["c"];
			let z = countryArrMain[i]["l"];
			
			let j = 0;
			for(let j = 0; j < z.length; j++){
			
				let opt = document.createElement('option');
				let k = JSON.parse(z[j]);
				opt.text = k.full || "Unknown";
				opt.value = "" + i + "-" + j; 		
				optGrp.appendChild(opt);
				//console.log(i,j,k);
			
			}
			sel.appendChild(optGrp);		
		}
		
		document.body.appendChild(sel);
		kl();
		
	}
	
	function kl(){
		let msCss = document.createElement('link');
		msCss.href = "static/multiple-select.css";
		msCss.rel = "stylesheet";
		
		let msCss2 = document.createElement('link');
		msCss2.href = "static/index-main.css";
		msCss2.rel = "stylesheet";
				
		document.body.appendChild(msCss);
		document.body.appendChild(msCss2);
		
		let tag = document.createElement("script");
		tag.src = "static/jquery.js";
		document.body.appendChild(tag);
		
		let jqLoaded = false;
		let msLoaded = false;
		let mainLoaded = false;
				
		tag.onload = function(){
			jqLoaded = true;
			let tag2 = document.createElement("script");
			tag2.src = "static/multiple-select.js";
			document.body.appendChild(tag2);
					
			tag2.onload = function(){
				msLoaded = true;
				let tag3 = document.createElement("script");
				tag3.src = "static/index-main.js";
				document.body.appendChild(tag3);
						
				tag3.onload = function(){
					mainLoaded = true;
					customFilter.init(true);
				}
			}
		}
	}
	
	function blo(){
		$("select").multipleSelect({
			multiple: true,
			multipleWidth: 250,
			width: '100%',
			styler: function(value) {
				let z = value.split('-');
				if (z.length == 2) {
					if(z[0]%2==0){
						if(z[1]%2==0)
							return styleStringSEvenCityEven;
						return styleStringSEvenCityOdd;
					} else{
						if(z[1]%2==0)
							return styleStringSOddCityEven;
						return styleStringSOddCityOdd;		
					}
				}
			}
		});
		$('select').multipleSelect('refresh');
	}

	
}