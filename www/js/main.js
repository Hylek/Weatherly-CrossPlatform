"use strict";

var audioElement;

var currentWeather = "";
var currentLocation = "";
var input = "";
var addedLocationsCount = 0;

var locationArray = [];
//var addedLocations[,] = "";

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
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);

	addedLocationsCount = window.localStorage.getItem("locationCount");
    
	locationArray = JSON.parse(window.localStorage.getItem("locations"));
	if(locationArray == null)
	{
		locationArray = [];
	}

	console.log(locationArray);

	if(localStorage.getItem("firstTime") === 1)
	{
		window.location = 'index.html#locations';
	}
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


	// $(function(){
  // 	$('.bxslider').bxSlider({
  //   	mode: 'fade',
  //   	captions: false,
  //   	slideWidth: 600
  // });

// 	$('.slick-test').slick({
// 	setting-name: setting-value
// });
// });
}

owl.on('changed.owl.carousel', function(event) {
	if(event.page.index == 3)
	{
		console.log("Loading locations page!");
		localStorage.setItem("firstTime", 1);
		window.location = 'index.html#locations';
	}
})

$(document).on('pagecreate', '#locations', function()
{
	var newPage;
	$('.add-button').on("click", function(event){
		//window.location = 'index.html#addLocation';
		
		if($('#wew').length <= 0) {
			newPage = $("<div data-role=page data-url=yay id=wew><div data-role=header><h1>YAY!!!!</h1></div><div data-role=content><img src=http://bukk.it/yay.gif /></div></div");
			newPage.appendTo( $.mobile.pageContainer );
		}
		$.mobile.changePage( newPage );
	});

	getWeather();

	for(var i = 0; i < locationArray.length; i++)
	{
		$('#locationList').empty().append('<li><a href = "#addedLocation">' + locationArray[i] + '</a><a class="deleteMe"></a></li>').listview('refresh');
	}

	var listElements = [];
	$("ul li").each(function() { listElements.push($(this).text()) });
	console.log(listElements);

	$('.deleteMe').on("click", function(event) {
		console.log("Remove element!");
		$(this).parent().remove();
		$('#locationList').listview('refresh');
	});
});

$(document).on('pagecreate', '#addLocation', function()
{
	console.log("In Add Location!");

	$('#addLocationButton').on("click", function(event){ 
		input = document.getElementById("locationSearch").value + " UK";
		console.log("Input! " + input);
		window.location = 'index.html#addedLocation';
		window.localStorage.setItem("locationCount", addedLocationsCount);
		locationArray.push(input);
		getWeatherViaCity();
	});
});

$(document).on('pagecreate', '#currentLocation', function()
{
	console.log("locations page loaded");

	$('.today').hide();
	$('.location-name').hide();
	$('.time-stamp').hide();
	$('.current-temp').hide(); 
	$('.current-cond').hide();
	$('.feels-like').hide();
	$('.today').hide();

	getWeather();

	$('.refresh-button').on("click", function(event){
		getWeather();
	});

	$('.back-button').on("click", function(event){
		window.location = 'index.html#locations';
	});

});

// $(document).on('pagebeforeshow', '#addedLocation', function()
// {
// 	console.log("Getting weather");

// 	// $('.today').hide();
// 	// $('.location-name').hide();
// 	// $('.time-stamp').hide();
// 	// $('.current-temp').hide(); 
// 	// $('.current-cond').hide();
// 	// $('.feels-like').hide();
// 	// $('.today').hide();

// 	// getWeatherViaCity();
// });

$(document).on('pagecreate', '#addedLocation', function()
{
	console.log("added locations page loaded");

	//getWeatherViaCity();

	console.log(locationArray);
});

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
			$.mobile.loading('show');
			$('.today').hide();
			$('.location-name').hide();
			$('.time-stamp').hide();
			$('.current-temp').hide(); 
			$('.current-cond').hide();
			$('.feels-like').hide();
		},
		complete: function(data) {
			$.mobile.loading('hide');
		},
		success: function(result) {
			console.log("Got something!", result);
			//addedLocationsCount += 1;
			//locationArray[addedLocationsCount] = input;
			window.localStorage.setItem("locations", JSON.stringify(locationArray));
			console.log(locationArray);
			$('.location-name').fadeIn('slow');
			$('.time-stamp').fadeIn('slow');
			$('.current-temp').fadeIn('slow');
			$('.current-cond').fadeIn('slow');
			$('.feels-like').fadeIn('slow');
			$('.today').fadeIn('slow');
			
			displayData(result);
		}	
	});
}

function getWeather()
{
	var lat = 0;
	var long = 0;

	navigator.geolocation.getCurrentPosition(function(pos){
		lat = pos.coords.latitude;
		long = pos.coords.longitude;
		console.log("COORDS " + lat + " " + long);

		//  $.get("https://api.apixu.com/v1/current.json?key=b3818c2db71747f78d2185718181403&q=" + lat + "," + long, function(data){
		//  	console.log("Found something!");
		// 	 displayData(data);
		// 	 var stringed = JSON.stringify(data);
		// 	 console.log("OLD VERSION " + stringed);
		// });

		$.ajax({
			url: 'https://api.apixu.com/v1/current.json?key=b3818c2db71747f78d2185718181403&q=' + lat + ',' + long,
			type: 'get',
			async: 'true',
			dataType: 'json',
			beforeSend: function() {
				$.mobile.loading('show');
				$('.today').hide();
				$('.current-location-name').hide();
				$('.time-stamp').hide();
				$('.current-temp').hide();
				$('.current-cond').hide();
				$('.feels-like').hide();
				$('.today').hide();
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
			}

			
			// error: function(request, error) {

			// }
		// });


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

			
			// error: function(request, error) {

			// }
		// });


		});
	});
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
		if(weather.includes("sunny"))
		{
			return "A";
		}
	}
	else
	{
		var weather = data.current.condition.text;
		if(weather.includes("rain") || weather.includes("drizzle"))
		{
			return "S";
		}
		if(weather.includes("sunny"))
		{
			return "A";
		}
		if(weather.includes("Partly") && weather.includes("cloudy") )
		{
			return "D";
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

// $(document).on('pagecreate', '#graph', function () {
// 	console.log("pagecreate graphs");

// 	//call chart functions
// 	create_pie_chart();
// 	create_line_chart();

// 	$(document).on("scrollstop", function(event)
// 	{
// 		var piechart = $('#donut').offset().top;
// 		var linechart = $('#line').offset().top;

// 		var topOfWindow = $(window).scrollTop();
// 		var h = $(window).height();

// 		console.log(piechart + ' ' + topOfWindow);
// 		if(piechart < topOfWindow + h)
// 		{
// 			create_pie_chart();
// 		}
// 		if(linechart < topOfWindow + h)
// 		{
// 			create_line_chart();
// 		}
// 	})
// });

// $(document).on('pagecreate', '#sound', function () {
// 	console.log("pagecreate sound");

// 	$('#soundbtn').on('click', function (event)
// 	{
// 		console.log("play");
// 		event.preventDefault();
// 		audioElement = document.createElement('audio');
// 		audioElement.setAttribute('src', 'assets/sound/beep.mp3');

// 		audioElement.play();
// 		navigator.vibrate(1000);
// 	});

// });







// 	function create_pie_chart() {
// 		console.log("donut");

// 		// adds the chart to a container div in our html with an ID donut
// 		// you can look up high charts docs but you do not need to understand below
// 		$('#donut').highcharts({
// 			chart: {
// 				plotBackgroundColor: null,
// 				plotBorderWidth: null,
// 				plotShadow: false,
// 				type: 'pie'
// 			},
// 			title: {
// 				text: 'My Events'
// 			},
// 			tooltip: {
// 				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
// 			},
// 			legend: {
// 				padding: 3,
// 				itemMarginTop: 5,
// 				itemMarginBottom: 5,
// 				itemStyle: {
// 					lineHeight: '14px',
// 					color: 'white',
// 					fontSize: '10px'
// 				}
// 			},
// 			plotOptions: {
// 				pie: {
// 					allowPointSelect: true,
// 					cursor: 'pointer',
// 					dataLabels: {
// 						enabled: false
// 					},
// 					showInLegend: true
// 				}
// 			},
// 			series: [{
// 				name: 'Events',
// 				colorByPoint: true,
// 				data: [{
// 					name: 'Football',
// 					y: 56.33
// 				}, {
// 					name: 'Judo',
// 					y: 24.03,
// 					sliced: true,
// 					selected: true
// 				}, {
// 					name: 'Dodge Ball',
// 					y: 10.38
// 				}, {
// 					name: 'Swimming',
// 					y: 4.77
// 				}, {
// 					name: 'Cricket',
// 					y: 0.91
// 				}],
// 				size: '90%',
// 				innerSize: '50%'
// 			}]
// 		});
// 	} //piechart

// 	function create_line_chart() {
// 		console.log("add line");
// 		// adds the chart to a container div in our html with an ID line
// 		// you can look up high charts docs but you do not need to understand below
// 		$('#line').highcharts({
// 			title: {
// 				text: 'Monthly Activity Visits',
// 				x: 0 //center
// 			},
// 			xAxis: {
// 				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
// 					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
// 				]
// 			},
// 			yAxis: {
// 				title: {
// 					text: 'Visits)'
// 				},
// 				plotLines: [{
// 					value: 0,
// 					width: 1,
// 					color: '#808080'
// 				}]
// 			},
// 			tooltip: {
// 				valueSuffix: ''
// 			},
// 			series: [{
// 				name: 'Football',
// 				data: [1, 2, 3, 4, 4, 4, 4, 4, 2, 2, 1, 1]
// 			}, {
// 				name: 'Judo',
// 				data: [2, 3, 4, 4, 4, 4, 4, 2, 2, 1, 1, 1]
// 			}, {
// 				name: 'Dodge Ball',
// 				data: [4, 4, 4, 4, 4, 2, 2, 1, 1, 2, 2, 2]
// 			}, {
// 				name: 'Swimming',
// 				data: [4, 4, 4, 2, 2, 1, 1, 3, 3, 3, 2, 1]
// 			}]
// 		});

// 	} //linechart
