var customFilter = (function(){
	var styleStringSOddCityEven = 'background-color: #BBDEFB; color: #0000ff;'; 
	var styleStringSOddCityOdd = 'background-color: #42A5F5; color: #0000ff;'; 
	var styleStringSEvenCityEven = 'background-color: #F0F4C3; color: #0000ff;'; 
	var styleStringSEvenCityOdd = 'background-color: #D4E157; color: #0000ff;';
	
	function fLogger(){
		let div = document.createElement('div');
		
		//let p = document.createElement('p');
		//p.id = "logger-result" 	
		let btn = document.createElement('button');
		btn.addEventListener('click', function(e){
			let q = $('select').multipleSelect('getSelects');
			console.log(q);
		});
		
		btn.textContent = "LOG";
		div.appendChild(btn);
		document.body.appendChild(div);
	}
	
	
	function fMain(){
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
	
	return {
		init:function(logging, loc_data){
			//
			// PARSE THE DATA
			// CREATE OPTION
			//
			
			fMain();
			if(logging){
				fLogger();
			}
		}
	};
})();

 