window.addEventListener("load",function() {
	/*
	*	Dom Helper Fuction
	*/
	function n(domNode) {
		// body...
		return document.querySelector(domNode);
	}

	/*
	*	Dom Node
	*/
	var getPos=n("#getPos");
	var watchPos=n("#watchPos");
	var clearPos=n("#clearWatch");
	var latitude=n('#latitude');
	var longitude=n('#longitude');
	var address=n('#addressName');
	var svgImg = n('#innerSvg');

	/*
	*	Global Variable
	*/
	var id;
	var html="";

	/*
	*	locationTrack object for finding location
	*/

	function locationTrack () {
		// body...
		this.detect=function() {
			try{
				if (navigator.geolocation) {
					return navigator.geolocation;
				}else{
					throw "Geolocation Api is not Supported";
					return false;
				}
			}catch(err){
				console.log("Error: "+err);
			}
		},
		this.showPosition=function(data) {
			var latitudeg=data.coords.latitude;
			var longitudeg=data.coords.longitude;
			n('#loader').removeAttribute('class');
			if (window.Storage) {
				sessionStorage.setItem("latitude",window.btoa(latitudeg));
				sessionStorage.setItem("longitude",window.btoa(longitudeg));
			};
			html ='<h3>Your Location</h3><div id="info"><p id="latitude">Latitude: '+latitudeg+'</p><p id="longitude">Longitude: '+longitudeg+'</p></div><div id="address"><h3>Address</h3><p id="addressName">'+'</p></div></div>';
			svgImg.innerHTML=html;
			var latlng= new google.maps.LatLng(latitudeg,longitudeg);
			var geocoder = geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //alert("Location: " + results[1].formatted_address);
                            n('#addressName').innerHTML=results[1].formatted_address;
                        }
                    }
             	});
             	return data;
		},
		this.errorPosition=function(error) {
			switch(error.code){
                case error.PERMISSION_DENIED:
                    document.getElementById("message").innerHTML="User Denied Request for Location";
                    break;
                case error.POSITION_UNAVAILABLE:
                    document.getElementById("message").innerHTML="Position Unavailable";
                    break;
                case error.TIMEOUT:
                    document.getElementById("message").innerHTML="The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    document.getElementById("message").innerHTML="An Unknown Error Occured.";
                        break;
                }
		},
		this.getPosition=function() {
			this.detect().getCurrentPosition(this.showPosition,this.errorPosition);
		},
		this.success=function(success) {
			console.log(success);
			document.writeln(success);
		},
		this.error=function(error) {
			console.log(error);
			document.writeln(error);
		},
		this.keepPositioning=function() {
			id= this.detect().watchPosition(this.success,this.error,{
				enableHighAcuracy: true,
				timeout: 1000,
				maxumumAge: 1000
			});
		}
	}

	locationTrack.prototype.stopPositioning = function() {
		// body...
		this.detect().clearWatch(id);
		console.log("Watch"+id+" Cleared.");
		id=null;
	};

	function googleMap () {
		// body...
		
		var lati=window.atob(sessionStorage.getItem("latitude"));
		var longi=window.atob(sessionStorage.getItem("longitude"));
		var myCenter =new google.maps.LatLng(lati,longi);
		var mapProp = {
    		center: myCenter,
    		zoom: 15,
    		mapTypeId:google.maps.MapTypeId.ROADMAP
  		};
  		var map=new google.maps.Map(document.getElementById("map"), mapProp);
		var marker = new google.maps.Marker({
			position: myCenter,
		});
		marker.setMap(map);
	}
	var button=n("#mapButton");
	google.maps.event.addDomListener(button,"click",googleMap);

	var location=new locationTrack();
	
	/*
	*	Find Position
	*/

	getPos.addEventListener("click",function() {
		svgImg.innerHTML='<div class="loader" id="loader"></div>';
		if (location.detect()) {
			location.getPosition();
		};
	},false);

	watchPos.addEventListener("click",function() {
		if (location.detect()) {
			location.keepPositioning();
		};
	},false);


	clearWatch.addEventListener("click",function() {
		if (location.detect()) {
			location.stopPositioning();
		};
	},false);


},false);

