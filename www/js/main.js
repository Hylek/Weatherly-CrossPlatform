"use strict";

var audioElement;

var state = 0;
var getTitle = 0;

var input = "";

var locationArray = [];
var userResponse;
var yesRatings;
var noRatings;
var ratingLocation;
var setRating;
var hasResponded;
var isAddedLocation = false;
var gotName = 0;
var locationToDelete = "";
var currentLocationName;

var showTutorial = false;

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
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);

	$('.CurrentLocTitle').hide();	
	$('#loc1').hide();
	$('#loc2').hide();
	$('#loc3').hide();
	$('#loc4').hide();
	$('.popup').hide();
	$('.community-ratings').hide();

	checkTutorial();

	//getUserAnswer();

	if(locationArray == null)
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

	$('.today').hide();
	$('.current-location-name').hide();
	$('.time-stamp').hide();
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

	getCurrentLocationName();

	if(locationArray[0] != "" && locationArray.length >= 1)
	{
		$('#loc1').html(locationArray[0]);
		$('#loc1').fadeIn('slow');
	}
	if(locationArray[1] != "" && locationArray.length >= 2)
	{
		$('#loc2').html(locationArray[1]);
		$('#loc2').fadeIn('slow');
	}
	if(locationArray[2] != "" && locationArray.length >= 3)
	{
		$('#loc3').html(locationArray[2]);
		$('#loc3').fadeIn('slow');
	}
	if(locationArray[3] != "" && locationArray.length >= 4)
	{
		$('#loc4').html(locationArray[3]);
		$('#loc4').fadeIn('slow');
	}
}

function checkTutorial()
{
	var tutorialStatus = localStorage.getItem("tutorialState");
	console.log("Checking tutorial status... " + tutorialStatus);
	if(tutorialStatus == null || tutorialStatus == "")
	{
		// Do tutorial
		console.log("Showing tutorial");
		showTutorial = true;
		window.location = 'index.html#tutorial-page-1';
	}
	if(tutorialStatus == 1)
	{
		// Tutorial is complete, skip it
		showTutorial = false;
	}
}

$(document).on('pageshow', '#tutorial-page-1', function()
{
	console.log("Showing tutorial page!");
	if(showTutorial)
	{
			$('.tutorial-title-1').html("Welcome to Weatherly");
			$('.tutorial-content-1').html("Weatherly is a community weather app that uses you, the user, to provide more accurate information on current weather at your location.<br><br> When there is adverse weather conditions at your present location, weatherly will ask you in the app if that weather is actually affecting your location.<br><br> You will then be able to see other people's responses to this location and other responses in different locations that you have added.");
			
			$('#tutorialButton-1').on('click', function(){
				console.log("Going to tutorial page 2!");
				window.location = 'index.html#tutorial-page-2';
				$('.tutorial-title-2').html("Required Permissions");
				$('.tutorial-content-2').html("This app requires your device location in order to provide you with weather updates.<br><br> If you do not consent to this permission, please stop using this app now.");
			});
		}
		if(!showTutorial)
		{
			window.location = 'index.html#locations';
		}
});

$(document).on('pageshow', '#tutorial-page-2', function()
{
	console.log("Showing 2nd tutorial page");
	$('#tutorialButton-2').on('click', function(){
		$('.tutorial-title-3').html("Things to know!");
		$('.tutorial-content-3').html("The first red item in the list is your CURRENT location, this will change as you move around!<br><br> Any added locations in orange can be deleted by simply tapping and holding for a few seconds!<br><br> And that's all you need to know! Tap the button below to get started!");
		console.log("Going to tutorial page 3!");
		window.location = 'index.html#tutorial-page-3';
	});
});

$(document).on('pageshow', '#tutorial-page-3', function()
{
	console.log("Showing final tutorial page");
	$('#tutorialButton-3').on('click', function(){
		console.log("Going into the app!");
		localStorage.setItem("tutorialState", 1);
		window.location = 'index.html#locations';
	});
});

owl.on('changed.owl.carousel', function(event) {
	if(event.page.index == 3)
	{
		console.log("Loading locations page!");
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

		if(input == "" || input == null || input == " ")
		{
			alert("Please enter a location to continue!");
		}
		if(locationArray.length <= 3 && input != "" && input != " ")
		{
			if($.inArray(input, locationArray) < 0)
			{
				locationArray.push(input);
				saveData();
				console.log("Stored Locations! " + localStorage.getItem("locations"));
			}
		}
		if(locationArray.indexOf(input) > 0)
		{
			console.log("Location has already been added!");
		}

		console.log(locationArray);
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
		getWeather();
	}
	if(state == 2)
	{
		getWeatherViaCity();
	}

	$('.refresh-button').on("click", function(event){
		if(state == 1)
		{
			clearPageData();
			getWeather();
		}
		if(state == 2)
		{
			clearPageData();
			getWeatherViaCity();
		}
	});

	if(state == 1)
	{
		updateCommunityRatings();
	}

	$('.back-button').on("click", function(event){
		$('.popup').slideUp();
		window.location = 'index.html#locations';
		state = 0;
	});
});

$('#addNewLocation').on("click", function(event){
	window.location = 'index.html#addLocation';
});

$('.yes-button').on("click", function(event){
	$('.popup').slideUp();
	userResponse = 1;
	setRating = true;
	getUserAnswer();
});

$('.no-button').on("click", function(event){
	$('.popup').slideUp();
	userResponse = 2;
	setRating = true;
	getUserAnswer();
});

$('#snow-button').on("click", function(event){
	$('.popup').slideUp();
	userResponse = 3;
	setRating = true;
	getUserAnswer();
});

$('#clear-button').on("click", function(event){
	$('.popup').slideUp();
	userResponse = 4;
	setRating = true;
	getUserAnswer();
});

$('.currentLocationItem').on('click', function(event){
	window.location = 'index.html#currentLocation';
	state = 1;
});

$('.CurrentLocTitle').on('click', function(event){
	state = 1;
	window.location = 'index.html#currentLocation';
});

$(document).on('pageshow', '#locations', function()
{
	console.log("SHOWED PAGE");
	clearPageData();
	getCurrentLocationName();

	loadData();

	console.log(locationArray);

	if(locationArray[0] != "" && locationArray.length >= 1)
	{
		$('#loc1').html(locationArray[0]);
		$('#loc1').fadeIn('slow');
	}
	if(locationArray[1] != "" && locationArray.length >= 2)
	{
		$('#loc2').html(locationArray[1]);
		$('#loc2').fadeIn('slow');
	}
	if(locationArray[2] != "" && locationArray.length >= 3)
	{
		$('#loc3').html(locationArray[2]);
		$('#loc3').fadeIn('slow');
	}
	if(locationArray[3] != "" && locationArray.length >= 4)
	{
		$('#loc4').html(locationArray[3]);
		$('#loc4').fadeIn('slow');
	}

	$('#loc1').on('click', function(event) {
		input = locationArray[0];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc2').on('click', function(event) {
		input = locationArray[1];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc3').on('click', function(event) {
		input = locationArray[2];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
	$('#loc4').on('click', function(event) {
		input = locationArray[3];
		state = 2;
		window.location = 'index.html#currentLocation';
	});
});

function clearPageData()
{
	$('.current-temp').html("Loading!");
	$('.today').hide();
	$('.current-location-name').hide();
	$('.time-stamp').hide();
	$('.current-cond').hide();
	$('.community-ratings').hide();
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

function loadData()
{
	var savedLocations;
	if(locationArray == null)
	{
		locationArray = [];
	}
	else if(locationArray != null)
	{
		savedLocations = localStorage.getItem("locations");
	}
	if(savedLocations == null)
	{
		console.log("THERE IS NO SAVED DATA");
	}
	else
	{
		locationArray = JSON.parse(localStorage["locations"]);
	}
}

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
		},
		complete: function(data) {
			//$.mobile.loading('hide');
		},
		success: function(result) {
			console.log("Got something!", result);
			console.log(locationArray);
			displayCurrentWeatherData(result);
			getUserAnswer();
			$('.current-location-name').fadeIn('slow');
			$('.time-stamp').fadeIn('slow');
			$('.current-temp').fadeIn('slow');
			$('.current-cond').fadeIn('slow');
			$('.feels-like').fadeIn('slow');
			$('.today').fadeIn('slow');
			$('.refresh').fadeIn('slow');
			$('.back-button').fadeIn('slow');
			$('.community-ratings').fadeIn('slow');

		}	
	});

	$.ajax({
		url: 'https://api.apixu.com/v1/forecast.json?key=b3818c2db71747f78d2185718181403&q=' + input + '&days=4',
		type: 'get',
		async: 'true',
		dataType: 'json',
		beforeSend: function() {
			//$.mobile.loading('show');
			console.log("GETTING FORECAST");
			$('.weekly-temp-tomorrow').hide();
			$('.tomorrow').hide();
			$('.weekly-temp-day2').hide();
			$('.weekly-temp-day3').hide();
		},
		complete: function(data) {
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
			},
			complete: function(data) {
				$.mobile.loading('hide');
			},
			success: function(result) {
				currentLocationName = result.location.name;
				console.log("Got current location's weather data!");
				displayCurrentWeatherData(result);
				getUserAnswer();
				
				$('.current-location-name').fadeIn('slow');
				$('.time-stamp').fadeIn('slow');
				$('.current-temp').fadeIn('slow');
				$('.current-cond').fadeIn('slow');
				$('.feels-like').fadeIn('slow');
				$('.today').fadeIn('slow');
				$('.refresh').fadeIn('slow');
				$('.weather-icon').fadeIn('slow');
				$('.back-button').fadeIn('slow');
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

function getUserData()
{
	$.ajax({
		url: 'https://secret-meadow-93624.herokuapp.com/ratings',
		type: 'GET',
		async: 'true',
		dataType: 'json',
		success: function(result) {
			for(var i = 0; i < result.length; i++)
			{
				console.log("JSON Count: " + i);
				if(result[i].location == currentLocationName)
				{
					console.log("Got the right location!");
				}
			}

			ratingLocation = result[0].location;
			console.log("CUSTOM API LOCATION: " + ratingLocation);
			yesRatings = result[0].yes;
			noRatings = result[0].no;

			if(ratingLocation == input)
			{
				isAddedLocation = true;
			}
		}
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
			for(var i = 0; i < result.length; i++)
			{
				console.log("JSON Count: " + i);
				console.log(currentLocationName);
				if(result[i].location == currentLocationName)
				{
					console.log("Got the right location!");
					ratingLocation = result[i].location;
					console.log("CUSTOM API LOCATION: " + ratingLocation);
					yesRatings = result[i].yes;
					noRatings = result[i].no;
					updateCommunityRatings();
				}
			}
			if(setRating)
			{
				postUserAnswer(result);
				setRating = false;
			}
		}
	});
}

function postUserAnswer(result)
{
	if(userResponse == 1)
	{
		$.ajax({
			url: 'https://secret-meadow-93624.herokuapp.com/ratings/5ac6ab40d3ebac00147e9aa3',
			type: 'PUT',
			async: 'true',
			data: {
				location: ratingLocation,
				yes: yesRatings = ++yesRatings,
				no: noRatings
			}
		});
		userResponse = 0;
		hasResponded = true;
		updateCommunityRatings();
	}
	if(userResponse == 2)
	{
		$.ajax({
			url: 'https://secret-meadow-93624.herokuapp.com/ratings/5ac6ab40d3ebac00147e9aa3',
			type: 'PUT',
			async: 'true',
			data: {
				location: ratingLocation, 
				yes: yesRatings,
				no: noRatings = ++noRatings
			}
		});
		userResponse = 0;
		hasResponded = true;
		updateCommunityRatings();
	}
}

function getCurrentLocationName()
{
	$('.CurrentLocTitle').html("Getting Your Location...");
	$('.CurrentLocTitle').fadeIn('slow');

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
			},
			complete: function(data) {
				$.mobile.loading('hide');
			},
			success: function(result) {
				$('.CurrentLocTitle').html(result.location.name);
			}
		});
	});
}

// Delete listeners start

$('#loc1').on("taphold", function(event){
	var index = locationArray.indexOf($('#loc1').text());
	console.log(index);

	if(index > -1)
	{
		locationArray.splice(index, 1);
	}
	$('#loc1').slideUp();
	$('.loc1-buffer').fadeOut('fast');

	saveData();
	console.log(locationArray);
});
$('#loc2').on("taphold", function(event){
	var index = locationArray.indexOf($('#loc2').text());
	console.log(index);
	if(index > -1)
	{
		locationArray.splice(index, 1);
	}

	$('#loc2').slideUp();
	$('.loc2-buffer').fadeOut('fast');

	saveData();
	console.log(locationArray);
});
$('#loc3').on("taphold", function(event){
	var index = locationArray.indexOf($('#loc3').text());
	console.log(index);
	if(index > -1)
	{
		locationArray.splice(index, 1);
	}

	$('#loc3').slideUp();
	$('.loc3-buffer').fadeOut('fast');

	saveData();
	console.log(locationArray);
});
$('#loc4').on("taphold", function(event){
	var index = locationArray.indexOf($('#loc4').text());
	console.log(index);
	if(index > -1)
	{
		locationArray.splice(index, 1);
	}
	$('#loc4').slideUp();
	$('.loc4-buffer').fadeOut('fast');

	saveData();
	console.log(locationArray);
});

// Delete listeners end

function restoreBuffers()
{
	$('.loc1-buffer').fadeIn('fast');
	$('.loc2-buffer').fadeIn('fast');
	$('.loc3-buffer').fadeIn('fast');
	$('.loc4-buffer').fadeIn('fast');
}

function updateCommunityRatings() 
{
	$('.community-ratings').html( "Community Report on Rain<br>" + "Yes: " + yesRatings + " No: " + noRatings);	
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
	currentLocationName = data.location.name;
	$('.current-location-name').html(data.location.name);
	$('.current-location-name-small').html(data.location.name);
	$('.current-location-name-list').html(data.location.name);
	$('.location-name-small').html(data.location.name);
	$('.time-stamp').html("LAST UPDATED: " + data.current.last_updated);
	$('.current-temp').html(data.current.temp_c + "C");
	$('.current-cond').html(data.current.condition.text);
	$('.feels-like').html("FEELS LIKE: " + data.current.feelslike_c + "C");
	$('.weather-icon').html(FigureOutIconType(data, 0));

		console.log("Current location: " + data.location.name);

		// Fadein popup asking for what the weather is really like!
		if(!hasResponded && state == 1)
		{
			updateCommunityRatings();
			$(".popup").slideDown();
			$('.community-ratings').fadeIn('slow');

		}
		else if(hasResponded && state == 1 /* && data.location.name === ratingLocation */)
		{
			console.log("Response has already been taken!");
			// if(data.location.name.includes(ratingLocation))
			// {
				updateCommunityRatings();
				$('.community-ratings').fadeIn('slow');
			// }
		}
	// else{
	// 	$('.community-ratings').fadeOut('slow');
	// }
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
