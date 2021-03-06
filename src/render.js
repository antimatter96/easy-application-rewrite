var renderer = (function() {

	var isMobile = false;

	function render(filteredData) {
		const startTime = performance.now();
		let deleteThis = document.getElementById("list");
		if(deleteThis) {
			deleteThis.parentElement.removeChild(deleteThis);
		}
		else {
			console.log("First ?");
		}

		let list = document.createElement("div");
		list.id = "list";

		for( let i = 0; i < filteredData.length; i++) {
			let e = filteredData[i];

			let listEntry = document.createElement("div");

			let listDivContainer = document.createElement("div");
			listEntry.classList.add("listentry-container");
			listDivContainer.classList.add("listEntry");

			let entryName = document.createElement("span");
			entryName.innerText = e.name;
			entryName.classList.add("entry-name");

			listDivContainer.appendChild(entryName);

			let entryLink = document.createElement("a");
			entryLink.href = e.url;
			let entryLinkMain = document.createElement("span");
			entryLinkMain.innerText = "Here";
			entryLink.classList.add("entry-link");
			entryLink.onclick = () => {trackOutboundLink(e.url); return false;};

			entryLinkMain.id = "link-to-" + e.name.replace(" ", "-").toLowerCase();
			entryLinkMain.onclick = () => {trackOutboundLink(e.url); return false;};

			entryLink.appendChild(entryLinkMain);



			if( e.locations ) {

				let locationDiv = document.createElement("div");
				locationDiv.classList.add("location-container");

				for(let x = 0; x < e.locations.length; x++) {
					let location = document.createElement("span");
					location.classList.add("location-entry");

					let locationName = document.createElement("span");
					let locationCountry = document.createElement("span");

					locationName.innerText = e.locations[x].loc;
					locationCountry.innerText = e.locations[x].country;

					locationName.classList.add("location-name");
					locationCountry.classList.add("location-country");

					location.appendChild(locationName);
					location.appendChild(locationCountry);

					locationDiv.appendChild(location);
				}

				listDivContainer.appendChild(locationDiv);
			}

			if(e.remote) {
				let remote = document.createElement("div");
				remote.innerText = "Remote";
				remote.classList.add("remote");
				listDivContainer.appendChild(remote);

			}

			listDivContainer.appendChild(entryLink);

			listEntry.appendChild(listDivContainer);
			list.appendChild(listEntry);
		}
		document.body.appendChild(list);
		const duration = performance.now() - startTime;
		console.log("Rendering of", filteredData.length, "took", duration, "ms");

		if(!isMobile) {
			const startTimeM = performance.now();
			var ms = new Masonry("#list", {
				horizontalOrder : true,
				itemSelector: ".listentry-container"
			});

			const durationM = performance.now() - startTimeM;
			console.log("Masonry", filteredData.length, "took", durationM, "ms");
		}
	}

	return {
		display:function(loc_data) {
			if(navigator.userAgent) {
				if( navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("iPad") || navigator.userAgent.includes("iPhone") ) {
					isMobile = true;
				}
			}
			render(loc_data);
		}
	};
})();
