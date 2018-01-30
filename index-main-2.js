  var customFilter = (function(){
	
	function fLogger(){
		let div = document.createElement('div');
		
		//let p = document.createElement('p');
		//p.id = "logger-result" 	
		let btn = document.createElement('button');
		btn.addEventListener('click', function(e){
			let q = $('thisone').value;
			console.log(q);
		});
		
		btn.textContent = "LOG";
		div.appendChild(btn);
		document.body.appendChild(div);
	}
	
	var selectedEntries;
	
	function changeHandler(evt, params){
		if(evt.type === 'change'){
			if(params.selected){
				console.log(params.selected);
			}
			else if(params.deselected){
				console.log(params.deselected);
			}
		}
	}
	
	function fMain(entries){
		fx(entries);
		console.log("Ads");
		$('.thisone').chosen({'width':'100%'});
		$('.thisone').on('change', changeHandler);
		changeHandler = new Set();
	}
	
	var countryMap;
	var countryArr;
	
	function fx(entries){
		console.log(entries);
		countryMap = new Map();
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
		
		//document.body.removeChild(document.body.firstElementChild);
		
		let sel = document.createElement('select');
		let dummyOption = document.createElement('option');
		dummyOption.value = "";
		
		sel.appendChild(dummyOption);
		
		let countryArrMain = [];
		for( let i = 0; i < countryArr.length; i++){
			let temp = {};
			temp["c"] =  countryArr[i][0];
			
			let arr = new Array(...countryArr[i][1]);
			arr = arr.sort();
			
			temp["l"] = arr;
			countryArrMain[i] = temp;
		}
		
		for( let i = 0; i < countryArrMain.length; i++){
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
			}
			sel.appendChild(optGrp);		
		}
		
		sel.multiple = true;
		sel.classList.add("chosen-select");
		sel.classList.add("thisone");
		
		document.getElementById("main").appendChild(sel);
		//document.body.insertBefore(sel, document.body.firstChild);
		//document.body.appendChild(sel);
		console.log("index-built");
	}
	
	
	return {
		init:function(logging, loc_data){
			//
			// PARSE THE DATA
			// CREATE OPTION
			//
			
			fMain(loc_data);
			if(logging){
				fLogger();
			}
		}
	};
})();

 