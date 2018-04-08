"use strict";

var audioElement;

var state = 0;
var getTitle = 0;

var input = "";

var locationArray = [,];
var storedLocations;
var userResponse;
var yesRatings;
var noRatings;
var setRating;
var hasResponded;
var gotName = 0;

// add device and doc ready

function onDeviceReady()
{
	console.log("Device is ready!");
	innit();
}

$(document).ready(function()
{
	console.log("ready!");
	innit();
})

var owl = $('.owl-carousel');

function innit() {
	$('.CurrentLocTitle').hide();	
	$('#loc1').hide();
	$('#loc2').hide();
	$('#loc3').hide();
	$('#loc4').hide();
	$('.popup').hide();
	$('.community-ratings').hide();
	//window.localStorage.clear();
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);

	console.log("Stored Locations: " + storedLocations);

	getUserAnswer();
	postUserAnswer();

	if(storedLocations == "[null]")
	{
		//window.localStorage.clear();
	}
	else if(locationArray == null)
	{
		locationArray = [];
	}

	userResponse = 0;
	setRating = false;
	hasResponded = false;
	$(".owl-carousel").owlCarousel({
			items: 1
	});

	if(window.navigator.onLine)
	{
		$('body').addClass('online');
	}
	else
	{
		$('body').addClass('offline');
	}

	$('.section-1').hide();
	$('.today').hide();
	$('.current-location-name').hide();
	$('.time-stamp').hide();
	$('.current-temp').hide();
	$('.current-cond').hide();
	$('.feels-like').hide();
	$('.today').hide();
	$('.weekly-temp-tomorrow').hide();
	$('.weekly-icon-tomorrow').hide();
	$('.tomorrow').hide();
	$('.refresh').hide();
	$('.weather-icon').hide();
	$('.weekly-temp-day2').hide();
	$('.weekly-temp-day3').hide();
	$('.weekly-icon-day2').hide();
	$('.weekly-icon-day3').hide();
	$('.day2').hide();
	$('.day3').hide();
	$('.back-button').hide();
}

owl.on('changed.owl.carousel', function(event) {
	if(event.page.index == 3)
	{
		console.log("Loading locations page!");
		//localStorage.setItem("firstTime", 1);
		window.location = 'index.html#locations';
	}
})

$(document).on('pageshow', '#addLocation', function()
{
	console.log("In Add Location!");

	$('#addLocationButton').on("click", function(event){ 
		input = document.getElementById("locationSearch").value;
		console.log("Input! " + input);
		state = 2;
		if(locationArray.length <= 3)
		{
			locationArray.push(input);
			saveData();
			console.log("Stored Locations! " + localStorage.getItem("locations"));
		}
		console.log(locationArray);
		$('.section-1').hide();
		window.location = 'index.html#currentLocation';
		console.log(state);
		restoreBuffers();
	});
});

$(document).on('pageshow', '#currentLocation', function()
{
	console.log("locations page loaded");

	if(state == 1)
	{
		$('.section-1').hide();
		getWeather();
	}
	if(state == 2)
	{
		$('.section-1').hide();
		getWeatherViaCity();
	}

	$('.refresh-button').on("click", function(event){
		if(state == 1)
		{
			$('.section-1').hide();
			getWeather();
		}
		if(state == 2)
		{
			$('.section-1').hide();
			getWeatherViaCity();
		}
	});

	updateCommunityRatings();

	$('.back-button').on("click", function(event){
		$('#loc1').hide();
		$('#loc2').hide();	
		$('#loc3').hide();
		$('#loc4').hide();
		window.location = 'index.html#locations';
		state = 0;
	});

});

$('.add-button').on("click", function(event){
	window.location = 'index.html#addLocation';
});

$('.yes-button').on("click", function(event){
	$('.popup').fadeOut('slow');
	userResponse = 1;
	setRating = true;
	getUserAnswer();
});

$('.no-button').on("click", function(event){
	$('.popup').fadeOut('slow');
	userResponse = 2;
	setRating = true;
	getUserAnswer();
});

$('.currentLocationItem').on('click', function(event){
	$('.section-1').hide();
	window.location = 'index.html#currentLocation';
	state = 1;
});

$('.CurrentLocTitle').on('click', function(event){
	$('.section-1').hide();
	state = 1;
	window.location = 'index.html#currentLocation';
});

$(document).on('pageshow', '#locations', function()
{
	console.log("SHOWED PAGE");

	getCurrentLocationName();

	storedLocations = localStorage.getItem("locations");
	if(storedLocations != null || storedLocations != "[null]")
	{
		//locationArray = JSON.parse(localStorage["locations"]);
		locationArray = JSON.parse(storedLocations); // This turns into a string WTF!
		console.log("Current Status of Location Array: " + locationArray);
		//locationArray = window.localStorage.getItem("locations");
	}
	console.log(locationArray);

	if(locationArray[0] != "")
	{
		$('#loc1').html(locationArray[0]);
	}
	if(locationArray[1] != "")
	{
		$('#loc2').html(locationArray[1]);
	}
	if(locationArray[2] != "")
	{
		$('#loc3').html(locationArray[2]);
	}
	if(locationArray[3] != "")
	{
		$('#loc4').html(locationArray[3]);
	}

	$('#loc1').on('click', function(event) {
		$('.section-1').hide();
		input = locationArray[0];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc2').on('click', function(event) {
		$('.section-1').hide();
		input = locationArray[1];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc3').on('click', function(event) {
		$('.section-1').hide();
		input = locationArray[2];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc4').on('click', function(event) {
		$('.section-1').hide();
		input = locationArray[3];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
});


function saveData()
{
	localStorage.setItem("locations", JSON.stringify(locationArray));
}

function getWeatherViaCity()
{
	console.log("Getting weather via city name");
	console.log(input);
	$.ajax({
		url: 'https://api.apixu.com/v1/current.json?key=b3818c2db71747f78d2185718181403&q=' + input,
		type: 'get',
		async: 'true',
		dataType: 'json',
		beforeSend: function() {
			//$.mobile.loading('show');
			$('.section-1').fadeOut('slow');
		},
		complete: function(data) {
			//$.mobile.loading('hide');
		},
		success: function(result) {
			console.log("Got something!", result);
			console.log(locationArray);
			displayCurrentWeatherData(result);
			$('.current-location-name').fadeIn('slow');
			$('.time-stamp').fadeIn('slow');
			$('.current-temp').fadeIn('slow');
			$('.current-cond').fadeIn('slow');
			$('.feels-like').fadeIn('slow');
			$('.today').fadeIn('slow');
			$('.section-1').fadeIn('slow');
			$('.refresh').fadeIn('slow');
			$('.back-button').fadeIn('slow');
		}	
	});

	$.ajax({
		url: 'https://api.apixu.com/v1/forecast.json?key=b3818c2db71747f78d2185718181403&q=' + input + '&days=4',
		type: 'get',
		async: 'true',
		dataType: 'json',
		beforeSend: function() {
			$.mobile.loading('show');
			console.log("GETTING FORECAST");
			$('.weekly-temp-tomorrow').hide();
			$('.tomorrow').hide();
			$('.weekly-temp-day2').hide();
			$('.weekly-temp-day3').hide();
		},
		complete: function(data) {
			$.mobile.loading('hide');
		},
		success: function(result) {
			displayForecastedWeatherData(result);

			$('.weekly-temp-tomorrow').fadeIn('slow');
			$('.tomorrow').fadeIn('slow');
			$('.day2').fadeIn('slow');
			$('.day3').fadeIn('slow');
			$('.weekly-temp-day2').fadeIn('slow');
			$('.weekly-temp-day3').fadeIn('slow');
			$('.weekly-icon-tomorrow').fadeIn('slow');
			$('.weekly-icon-day2').fadeIn('slow');
			$('.weekly-icon-day3').fadeIn('slow');
			$('.weather-icon').fadeIn('slow');
		}
	});
}

function getName(index)
{
	var locationName = locationArray[index];
	return locationName;
}

function getWeather()
{
	var lat = 0;
	var long = 0;

	navigator.geolocation.getCurrentPosition(function(pos){
		lat = pos.coords.latitude;
		long = pos.coords.longitude;
		console.log("COORDS " + lat + " " + long);

		$.ajax({
			url: 'https://api.apixu.com/v1/current.json?key=b3818c2db71747f78d2185718181403&q=' + lat + ',' + long,
			type: 'get',
			async: 'true',
			dataType: 'json',
			beforeSend: function() {
				$.mobile.loading('show');
				$('.section-1').fadeOut('slow');
			},
			complete: function(data) {
				$.mobile.loading('hide');
			},
			success: function(result) {
				displayCurrentWeatherData(result);
				
				$('.current-location-name').fadeIn('slow');
				$('.time-stamp').fadeIn('slow');
				$('.current-temp').fadeIn('slow');
				$('.current-cond').fadeIn('slow');
				$('.feels-like').fadeIn('slow');
				$('.today').fadeIn('slow');
				$('.refresh').fadeIn('slow');
				$('.weather-icon').fadeIn('slow');
				$('.back-button').fadeIn('slow');
				$('.section-1').fadeIn('slow');
			}
		});

		$.ajax({
			url: 'https://api.apixu.com/v1/forecast.json?key=b3818c2db71747f78d2185718181403&q=' + lat + ',' + long + '&days=4',
			type: 'get',
			async: 'true',
			dataType: 'json',
			beforeSend: function() {
				$.mobile.loading('show');
				console.log("GETTING FORECAST");
				$('.weekly-temp-tomorrow').hide();
				$('.tomorrow').hide();
				$('.weekly-temp-day2').hide();
				$('.weekly-temp-day3').hide();
			},
			complete: function(data) {
				$.mobile.loading('hide');
			},
			success: function(result) {
				displayForecastedWeatherData(result);
				$('.weekly-temp-tomorrow').fadeIn('slow');
				$('.tomorrow').fadeIn('slow');
				$('.day2').fadeIn('slow');
				$('.day3').fadeIn('slow');
				$('.weekly-temp-day2').fadeIn('slow');
				$('.weekly-temp-day3').fadeIn('slow');
				$('.weekly-icon-tomorrow').fadeIn('slow');
				$('.weekly-icon-day2').fadeIn('slow');
				$('.weekly-icon-day3').fadeIn('slow');
				$('.weather-icon').fadeIn('slow');
			}
		});
	});
}

function getUserAnswer()
{
	$.ajax({
		url: 'https://secret-meadow-93624.herokuapp.com/ratings',
		type: 'GET',
		async: 'true',
		dataType: 'json',
		success: function(result) {
			//console.log(ratings[0].yes);
			yesRatings = result[0].yes;
			noRatings = result[0].no;
			if(setRating)
			{
				postUserAnswer();
				setRating = false;
			}
		}
	});
}

function postUserAnswer()
{
	if(userResponse == 1)
	{
		$.ajax({
			url: 'https://secret-meadow-93624.herokuapp.com/ratings/5ac6ab40d3ebac00147e9aa3',
			type: 'PUT',
			async: 'true',
			data: {
				location: "Lincoln", // This will be data.location.name
				yes: yesRatings = ++yesRatings,
				no: noRatings
			}
		});
		userResponse = 0;
		hasResponded = true;
	}
	if(userResponse == 2)
	{
		$.ajax({
			url: 'https://secret-meadow-93624.herokuapp.com/ratings/5ac6ab40d3ebac00147e9aa3',
			type: 'PUT',
			async: 'true',
			data: {
				location: "Lincoln", // This will be data.location.name
				yes: yesRatings,
				no: noRatings = ++noRatings
			}
		});
		userResponse = 0;
		hasResponded = true;
	}
}

function getCurrentLocationName()
{
	navigator.geolocation.getCurrentPosition(function(pos){
		var lat = pos.coords.latitude;
		var long = pos.coords.longitude;
		console.log("COORDS " + lat + " " + long);

		$.ajax({
			url: 'https://api.apixu.com/v1/current.json?key=b3818c2db71747f78d2185718181403&q=' + lat + ',' + long,
			type: 'get',
			async: 'true',
			dataType: 'json',
			beforeSend: function() {
				$('.CurrentLocTitle').hide();
			},
			complete: function(data) {
				$.mobile.loading('hide');
			},
			success: function(result) {
				$('.CurrentLocTitle').html(result.location.name);
				$('.CurrentLocTitle').fadeIn('slow');
				if(locationArray.length >= 1)
				{
					$('#loc1').fadeIn('slow');
				}
				if(locationArray.length >= 2)
				{
					$('#loc2').fadeIn('slow');
				}
				if(locationArray.length >= 3)
				{
					$('#loc3').fadeIn('slow');
				}
				if(locationArray.length >= 4)
				{
					$('#loc4').fadeIn('slow');
				}
			}
		});
	});
}

$('#loc1').on("taphold", function(event){
	$('#loc1').fadeOut('fast');
	$('.loc1-buffer').fadeOut('fast');
	saveData();
	console.log(locationArray);
	console.log(locationArray.find());
});
$('#loc2').on("taphold", function(event){
	$('#loc2').fadeOut('fast');
	$('.loc2-buffer').fadeOut('fast');

	saveData();
});
$('#loc3').on("taphold", function(event){
	$('#loc3').fadeOut('fast');
	$('.loc3-buffer').fadeOut('fast');

	saveData();
	console.log(locationArray);
});
$('#loc4').on("taphold", function(event){
	$('#loc4').fadeOut('fast');
	$('.loc4-buffer').fadeOut('fast');
	locationArray.pop();
	saveData();
	console.log(locationArray);
});

function restoreBuffers()
{
	$('.loc1-buffer').fadeIn('fast');
	$('.loc2-buffer').fadeIn('fast');
	$('.loc3-buffer').fadeIn('fast');
	$('.loc4-buffer').fadeIn('fast');
}

function updateCommunityRatings() 
{
	$('.community-ratings').html("Yes: " + yesRatings + " No: " + noRatings);	
}

function displayForecastedWeatherData(data)
{
	var days = data.forecast.forecastday;
	$('.weekly-temp-tomorrow').html(days[1].day.avgtemp_c + "C");
	$('.weekly-temp-day2').html(days[2].day.avgtemp_c + "C");
	$('.weekly-temp-day3').html(days[3].day.avgtemp_c + "C");
	$('.day2').html(FigureOutDayOfWeek(data, 2));
	$('.day3').html(FigureOutDayOfWeek(data, 3));
	$('.weekly-icon-tomorrow').html(FigureOutIconType(data, 1));
	$('.weekly-icon-day2').html(FigureOutIconType(data, 2));
	$('.weekly-icon-day3').html(FigureOutIconType(data, 3));

	console.log(days);
}

function displayCurrentWeatherData(data)
{
	$('.current-location-name').html(data.location.name);
	$('.current-location-name-small').html(data.location.name);
	$('.current-location-name-list').html(data.location.name);
	$('.location-name-small').html(data.location.name);
	$('.time-stamp').html("LAST UPDATED: " + data.current.last_updated);
	$('.current-temp').html(data.current.temp_c + "C");
	$('.current-cond').html(data.current.condition.text);
	$('.feels-like').html("FEELS LIKE: " + data.current.feelslike_c + "C");
	$('.weather-icon').html(FigureOutIconType(data, 0));

	if(data.current.condition.text.includes("rain") || data.current.condition.text.includes("snow"))
	{
		console.log("It is raining currently!");

		// Fadein popup asking if it is actually raining!
		if(!hasResponded)
		{
			updateCommunityRatings();
			$(".popup").fadeIn('slow');
			$('.community-ratings').fadeIn('slow');
		}
	}
	else{
		$('.community-ratings').fadeOut('slow');
	}
}

function displayData(data)
{
	$('.location-name').html(data.location.name);
	$('.location-name-small').html(data.location.name);
	$('.time-stamp').html("LAST UPDATED: " + data.current.last_updated);
	$('.current-temp').html(data.current.temp_c + "C");
	$('.current-cond').html(data.current.condition.text);
	$('.feels-like').html("FEELS LIKE: " + data.current.feelslike_c + "C");
}

function FigureOutDayOfWeek(data, day)
{
	var days = data.forecast.forecastday;
	var weekDays = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

	var date = days[day].date
	var formattedDate = date.replace("-", ",").replace("-", ",");
	var newDate = new Date(formattedDate);
	return weekDays[newDate.getDay()];
}

function FigureOutIconType(data, day)
{
	if(day != 0)
	{
		var days = data.forecast.forecastday;
		var weather = days[day].day.condition.text;
	
		if(weather.includes("rain") || weather.includes("drizzle"))
		{
			return "S";
		}
		if(weather.includes("Sunny") || weather.includes("Clear"))
		{
			return "A";
		}
		if(weather.includes("Partly") && weather.includes("cloudy") )
		{
			return "D";
		}
		if(weather.includes("OverCast"))
		{
			return "C";
		}
		if(weather.includes("Fog"))
		{
			return "G";
		}
		if(weather.includes("Mist"))
		{
			return "E";
		}
	}
	else
	{
		var weather = data.current.condition.text;
		if(weather.includes("rain") || weather.includes("drizzle"))
		{
			return "S";
		}
		if(weather.includes("Sunny"))
		{
			return "A";
		}
		if(weather.includes("Partly") && weather.includes("cloudy") )
		{
			return "D";
		}
		if(weather.includes("OverCast"))
		{
			return "C";
		}
		if(weather.includes("Fog"))
		{
			return "G";
		}
		if(weather.includes("Mist"))
		{
			return "E";
		}
	}
}

// handle online and offline intermittent connectivity

function onOffline()
{
	$('body').addClass('online');
	$('body').removeClass('offline');
}
function onOnline()
{
	$('body').addClass('online');
	$('body').removeClass('offline');
}

$(document).on("pagebeforeshow", function () {
	// When entering pagetwo
	//alert("page is about to be shown");

});

$(document).on("pagecontainershow", function () {
	// When entering pagetwo

});

$(document).on("pagecontainerload", function (event, data) {
	//alert("pageload event fired!");
});

$(document).on('pagecreate', '#menu', function () {
	console.log("pagecreate menu");

});