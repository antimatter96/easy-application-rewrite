var customFilter=(function(){var selectedEntries;function searchFilter(){const startTime=performance.now();let selectedEntriesArray=new Array(...selectedEntries);if(isMobile){let selectedOptions=document.getElementById("customFilter-select").selectedOptions;for(let i=0;i<selectedOptions.length;i++){if(selectedOptions[i].value){selectedEntriesArray.push(selectedOptions[i].value);}}}
if(selectedEntriesArray.length<1){return;}
selectedEntriesArray.sort();let selectedEntriesObjectArray;let tt=[];for(let i=0;i<selectedEntriesArray.length;i++){let countryIndex=selectedEntriesArray[i].split("-")[0];let locIndex=selectedEntriesArray[i].split("-")[1];let countryString=countryArrMain[countryIndex]["c"].split("{")[0].trimRight();let locationString=countryArrMain[countryIndex]["l"][locIndex].split(":")[2];locationString=locationString.replace(/"|}/g,"");tt.push({"c":countryString,"l":locationString});}
let finalS=[];for(let i=0;i<locationData.length;i++){let locations=locationData[i].ls;let isWanted=false;if(!locations){continue;}
for(let j=0;j<locations.length;j++){let thisC=locations[j].c;let thisL=locations[j].l;for(let k=0;k<tt.length;k++){if(tt[k].c==thisC&&tt[k].l==thisL){isWanted=true;break;}}
if(isWanted){break;}}
if(isWanted){finalS.push(locationData[i]);}}
const duration=performance.now()-startTime;console.log(`searchFilter took ${duration}ms`);renderFunction(finalS);}
function changeHandler(evt,params){if(evt.type==="change"){if(params.selected){selectedEntries.add(params.selected);}
else if(params.deselected){selectedEntries.delete(params.deselected);}}}
function determineMobile(){if(navigator.userAgent){if(navigator.userAgent.includes("Mobile")||navigator.userAgent.includes("iPad")||navigator.userAgent.includes("iPhone")){return true;}}
return false;}
var isMobile=false;function fMain(entries){fx(entries);$(".thisone").chosen({"width":"100%"});if(!isMobile){$(".thisone").on("change",changeHandler);}
selectedEntries=new Set();$("#filter-do").on("click",searchFilter);document.getElementById("filter-do").hidden=false;document.getElementById("filter-start").hidden=true;}
var countryMap;var countryArr;var countryArrMain;function fx(entries){console.log("Start fMain");const startTime=performance.now();countryMap=new Map();for(let i=0;i<entries.length;i++){let locEntry=entries[i].ls;if(!locEntry){continue;}
for(let j=0;j<locEntry.length;j++){let country=locEntry[j].c;let loc=locEntry[j].l;if(!loc&&!country){continue;}
if(!country){country="World";}
if(!loc){loc="Unknown";}
loc=loc.toLowerCase();loc=loc.replace(/\s|,|'/g,"");let mapEntry=countryMap.get(country);let z={"l":loc,"full":locEntry[j].l};let x=JSON.stringify(z);if(mapEntry){if(mapEntry.has(x)){continue;}else{mapEntry.add(x);}}
else{countryMap.set(country,new Set([x]));}}}
countryArr=[];let countryIter=countryMap.entries();let country=countryIter.next();while(!country.done){countryArr.push(country.value);country=countryIter.next();}
countryArr=countryArr.sort(function(a,b){if(a[1].size>b[1].size){return-1;}
else if(a[1].size<b[1].size){return 1;}
else{return a[0]>b[0];}});let sel=document.createElement("select");if(!isMobile){let dummyOption=document.createElement("option");dummyOption.value="";sel.appendChild(dummyOption);}
countryArrMain=[];for(let i=0;i<countryArr.length;i++){let temp={};temp["c"]=countryArr[i][0];let arr=new Array(...countryArr[i][1]);arr=arr.sort();temp["l"]=arr;countryArrMain[i]=temp;}
for(let i=0;i<countryArrMain.length;i++){let optGrp=document.createElement("optgroup");optGrp.label=countryArrMain[i]["c"];let z=countryArrMain[i]["l"];for(let j=0;j<z.length;j++){let opt=document.createElement("option");let k=JSON.parse(z[j]);opt.text=k.full||"Unknown";opt.value=""+i+"-"+j;optGrp.appendChild(opt);}
sel.appendChild(optGrp);}
sel.multiple=true;sel.classList.add("chosen-select");sel.classList.add("thisone");sel.id="customFilter-select";document.getElementById("main").appendChild(sel);const duration=performance.now()-startTime;console.log(`fMain took ${duration}ms`);}
var locationData;var renderFunction;return{init:function(logging,loc_data,_renderFunction){renderFunction=_renderFunction;locationData=loc_data;isMobile=determineMobile();fMain(loc_data);}};})();