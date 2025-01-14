var stillActive = false;
const INPUT_PAUSE = 700;
const BLOCK_LIMIT = 16;
const TITLE_LIMIT = 42;
const WEATHER_API_KEY = ["YTU0ZjkxOThkODY4YTJhNjk4ZDQ1MGRlN2NiODBiNDU=", "Y2U1M2Y3MDdhZWMyZDk1NjEwZjIwYjk4Y2VjYzA1NzE=", "N2M1NDFjYWVmNWZjNzQ2N2ZjNzI2N2UyZjc1NjQ5YTk="];
const UNSPLASH = "https://source.unsplash.com/collection/4933370/1920x1200/daily";
const DATE = new Date();
const HOURS = DATE.getHours();
const CREDITS = [
	{
		"title": "Santa Monica",
		"artist": "Avi Richards",
		"url": "https://unsplash.com/photos/KCgADeYejng",
		"id": "avi-richards-beach"
	},
	{
		"title": "Waimea Canyon",
		"artist": "Tyler Casey",
		"url": "https://unsplash.com/photos/zMyZrfcLXQE",
		"id": "tyler-casey-landscape"
	},
	{
		"title": "Fern",
		"artist": "Tahoe Beetschen",
		"url": "https://unsplash.com/photos/Tlw9fp2Z-8g",
		"id": "tahoe-beetschen-ferns"
	},
	{
		"title": "iOS 13 light wallpaper",
		"artist": "Apple",
		"url": "https://www.apple.com/ios/ios-13-preview/",
		"id": "ios13_light"
	},
	{
		"title": "iOS 13 dark wallpaper",
		"artist": "Apple",
		"url": "https://www.apple.com/ios/ios-13-preview/",
		"id": "ios13_dark"
	},
	{
		"title": "Unsplash Collection",
		"artist": "lots of artists",
		"url": "https://unsplash.com/collections/4933370/bonjourr-backgrounds",
		"id": "unsplash.com"
	}];


function id(name) {
	return document.getElementById(name);
}
function cl(name) {
	return document.getElementsByClassName(name);
}
function tg(name) {
	return document.getElementsbyTagName(name);
}
function getCl(that) {
	return that.getAttribute("class");
}
function setClass(that, val) {
	that.setAttribute("class", val);
}

function storage(cat, val) {

	if (localStorage.data) {
		var data = JSON.parse(localStorage.data);
	} else {
		var data = {};
	}

	if (cat) {

		if (val) {

			data[cat] = val;
			localStorage.data = JSON.stringify(data);

		} else return data[cat];
	} else return data;
}


//c'est juste pour debug le storage
function deleteBrowserStorage() {
	localStorage.clear();
}

//c'est juste pour debug le storage
function getBrowserStorage() {
	console.log(localStorage);
}

function slow(that) {

	that.setAttribute("disabled", "");

	stillActive = setTimeout(function() {

		that.removeAttribute("disabled");

		clearTimeout(stillActive);
		stillActive = false;
	}, INPUT_PAUSE);
}

function traduction() {

	let trns = document.getElementsByClassName('trn');
	let local = localStorage.lang;
	let dom = [];

	if (local && local !== "en") {

		for (let k = 0; k < trns.length; k++) {

			/*console.log(k)
			console.log(dict[trns[k].innerText])*/

			dom.push(dict[trns[k].innerText][localStorage.lang])
		}
			
		for (let i = 0; i < trns.length; i++) {
			trns[i].innerText = dom[i]
		}
	}
}

function tradThis(str) {

	var lang = localStorage.lang;

	if (!lang || lang === "en") {
		return str
	} else {
		return dict[str][localStorage.lang]
	}
}

function clock() {

	//pour gerer timezone
	//prendre le timezone du weather
	//le diviser par 60 * 60
	//rajouter le résultat à l'heure actuelle

	var timesup, format;

	function start() {

		function fixSmallMinutes(i) {
			if (i < 10) {i = "0" + i};
			return i;
		}

		function is12hours(x) {

			if (x > 12) x -= 12; 
			if (x === 0) x = 12;

			return x;
		}

		var h = new Date().getHours();
		var m = new Date().getMinutes();
		m = fixSmallMinutes(m);

		if (format === 12) h = is12hours(h);

		id('clock').innerText = h + ":" + m;

		timesup = setTimeout(start, 5000);
	}


	//settings event
	id("i_ampm").onchange = function() {

		//change le format 
		if (this.checked) {

			format = 12;
			clearTimeout(timesup);
			start();

		} else {

			format = 24;
			clearTimeout(timesup);
			start();
		}

		//enregistre partout suivant le format
		storage("clockformat", format);
		localStorage.clockformat = format;
	}

	format = parseInt(localStorage.clockformat);
	start();
}

function date() {

	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	//la date defini l'index dans la liste des jours et mois pour l'afficher en toute lettres
	id("jour").innerText = tradThis(days[DATE.getDay()]);
	id("chiffre").innerText = DATE.getDate();
	id("mois").innerText = tradThis(months[DATE.getMonth()]);
}

function greetings() {
	let h = DATE.getHours();
	let message;

	if (h > 6 && h < 12) {
		message = tradThis('Good Morning');
	} else if (h >= 12 && h < 18) {
		message = tradThis('Good Afternoon');
	} else if (h >= 18 && h <= 23) {
		message = tradThis('Good Evening');
	} else {
		message = tradThis('Good Night');
	}

	id("greetings").innerText = message;
}

function quickLinks() {

	var stillActive = false;
	var canRemove = false;

	//initialise les blocs en fonction du storage
	//utilise simplement une boucle de appendblock
	function initblocks() {

		var data = storage();

		if (data.links && data.links.length > 0) {

			//1.6 fix
			//if (data.links[0].icon.includes("https://besticon-demo.herokuapp.com")) {
				//oldFaviconFix();
			//}

			for (var i = 0; i < data.links.length; i++) {
				appendblock(data.links[i], i, data.links);
			}
		}

		id("interface").onmousedown = function stopwiggle(e) {

			//si c'est wiggly, accepte de le déwiggler
			if (canRemove) {

				var isStoppable = true;
				var parent = e.target;

				while (parent !== null) {

					//console.log(parent);
					parent = parent.parentElement;
					if (parent && parent.id === "linkblocks") isStoppable = false;
				}

				if (isStoppable) wiggle(this, false);
			}
		}
	}

	function appendblock(arr, index, links) {

		//console.log(arr)
		var icon = (arr.icon.length > 0 ? arr.icon : "src/images/loading.gif");

		//le DOM du block
		var b = "<div class='block' source='" + arr.url + "'><div class='l_icon_wrap'><button class='remove'><img src='src/images/icons/x.png' /></button><img class='l_icon' src='" + icon + "'></div><span>" + arr.title + "</span></div>";

		//ajoute un wrap
		var block_parent = document.createElement('div');
		block_parent.setAttribute("class", "block_parent");
		block_parent.innerHTML = b;

		//l'ajoute au dom
		id("linkblocks").appendChild(block_parent);

		//met les events au dernier elem rajouté
		addEvents(id("linkblocks").lastElementChild);

		//si online et l'icon charge, en rechercher une
		if (window.navigator.onLine && icon === "src/images/loading.gif")
			addIcon(id("linkblocks").lastElementChild, arr, index, links);
	}

	function addEvents(elem) {

		//wow
		var remove = elem.firstElementChild.firstElementChild.firstElementChild;

		elem.oncontextmenu = function startwiggle(e) {
			event.preventDefault();
			wiggle(this, true);
		}

		elem.onmouseup = function test(e) {
			openlink(this, e);
		}

		remove.onmouseup = function remBlock(e) {
			removeblock(this, e)
		}
	}

	function wiggle(that, on) {

		/*console.log(that)
		console.log(on)*/

		var bl = cl("block");

		if (on) {
			for (var i = 0; i < bl.length; i++) {
				bl[i].setAttribute("class", "block wiggly");
				bl[i].children[0].children[0].setAttribute("class", "remove visible");
			}
			canRemove = true;
		} else {
			for (var i = 0; i < bl.length; i++) {
				bl[i].setAttribute("class", "block");
				bl[i].children[0].children[0].setAttribute("class", "remove");
			}
			canRemove = false;
		}
	}

	function removeblock(that, e) {

		//console.log(that);
		var bp = that.parentElement.parentElement.parentElement;
		var sibling = bp;
		var count = -2;

		//trouve l'index avec le nombre d'elements dans linkblocks
		while (sibling.id !== "hiddenlink" || count === 16) {

			sibling = sibling.previousSibling;
			count++;
		}

		var data = storage();

		function ejectIntruder(arr) {

			if (arr.length === 1) {
				return []
			}

			if (count === 0) {

				arr.shift();
				return arr;
			}
			else if (count === arr.length) {

				arr.pop();
				return arr;
			}
			else {

				arr.splice(count, 1);
				return arr;
			}
		}

		var linkRemd = ejectIntruder(data.links);

		//si on supprime un block quand la limite est atteinte
		//réactive les inputs
		if (linkRemd.length === BLOCK_LIMIT - 1) {

			id("i_url").removeAttribute("disabled");
		}

		//enleve le html du block
		var block_parent = id("linkblocks").children[count + 1];
		block_parent.setAttribute("class", "block_parent removed");
		
		setTimeout(function() {

			id("linkblocks").removeChild(block_parent);

			//enleve linkblocks si il n'y a plus de links
			if (linkRemd.length === 0) {
				id("linkblocks").style.visibility = "hidden";
				searchbarFlexControl(data.searchbar, 0);
			}
		}, 200);

		storage("links", linkRemd);
	}

	function addIcon(elem, arr, index, links) {

		function faviconXHR(url) {

			return new Promise(function(resolve, reject) {

				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, true);

				xhr.onload = function() {

					if (xhr.status >= 200 && xhr.status < 400) {
						resolve(JSON.parse(this.response))
					}
				}

				xhr.onerror = reject;
				xhr.send()
			})
		}

		function filterIcon(json) {
			//prend le json de favicongrabber et garde la meilleure

			var s = 0;
			var a, b = 0;

			//garde la favicon la plus grande
			for (var i = 0; i < json.icons.length; i++) {	

				if (json.icons[i].sizes) {

					a = parseInt(json.icons[i].sizes);

					if (a > b) {
						s = i;
						b = a;
					}

				//si il y a une icone android ou apple, la prendre direct
				} else if (json.icons[i].src.includes("android-chrome") || json.icons[i].src.includes("apple-touch")) {
					return json.icons[i].src;
				}
			}

			//si l'url n'a pas d'icones, utiliser besticon
			if (json.icons.length === 0) {
				return "https://besticon.herokuapp.com/icon?url=" + json.domain + "&size=80"
			} else {
				return json.icons[s].src;
			}
		}

		//prend le domaine de n'importe quelle url
		var a = document.createElement('a');
		a.href = arr.url;
		var hostname = a.hostname;

		faviconXHR("https://favicongrabber.com/api/grab/" + hostname).then((icon) => {

			var img = elem.firstElementChild.firstElementChild.children[1];
			var icn = filterIcon(icon);
			img.src = icn;

			links[index].icon = icn;
			storage("links", links);
		})
	}

	function linkSubmission() {

		function submissionError(erreur) {

			//affiche le texte d'erreur
			id("wrongURL").innerText = erreur[1];
			id("wrongURL").style.display = "block";
			id("wrongURL").style.opacity = 1;
			
			setTimeout(function() {
				id("wrongURL").style.display = "none";
			}, 2000);		
		}

		function filterUrl(str) {

			//var ipReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/[-a-zA-Z0-9@:%._\+~#=]{2,256})?$/;
			//var reg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
			var reg = new RegExp("^(http|https)://", "i");

			//config ne marche pas
			if (str.startsWith("about:") || str.startsWith("chrome://")) {
				return [str, "Bonjourr doesn't have permissions to access browser urls"];
			}

			if (str.startsWith("file://")) {
				return str;
			}

			//premier regex pour savoir si c'est http
			if (!str.match(reg)) {
				str = "http://" + str;
			}

			//deuxieme pour savoir si il est valide (avec http)
			if (str.match(reg)) {
				return str.match(reg).input;
			} else {
				return [str, "URL not valid"];
			}
		}

		function saveLink(lll) {

			slow(id("i_url"));

			//remet a zero les inputs
			id("i_title").value = "";
			id("i_url").value = "";

			var full = false;
			var data = storage();
			var arr = [];

			//array est tout les links + le nouveau
			if (data.links && data.links.length > 0) {

				if (data.links.length < BLOCK_LIMIT - 1) {

					arr = data.links;
					arr.push(lll);

				} else {
					full = true;
				}

			//array est seulement le link
			} else {
				arr.push(lll);
				id("linkblocks").style.visibility = "visible";
				searchbarFlexControl(data.searchbar, 1);
			}
			
			//si les blocks sont moins que 16
			if (!full) {
				storage("links", arr);
				//console.log(lll);
				appendblock(lll, arr.length - 1, arr);
			} else {

				//desactive tout les input url
				id("i_url").setAttribute("disabled", "disabled");
				submissionError([id("i_url").value, "No more than 16 links"]);
			}
		}

		//append avec le titre, l'url ET l'index du bloc
		var title = id("i_title").value;
		var url = id("i_url").value;
		var filtered = filterUrl(url);

		//Titre trop long, on rajoute "...""
		if (title.length > TITLE_LIMIT) title = title.slice(0, TITLE_LIMIT) + "...";

		//si l'url filtré est juste
		if (typeof(filtered) !== "object" && filtered) {


			//et l'input n'a pas été activé ya -1s
			if (!stillActive) {

				var links = {
					title: title,
					url: filtered,
					icon: ""
				}

				saveLink(links);
			}

		} else {
			if (url.length > 0) submissionError(filtered);
		}
	}

	function openlink(that, e) {

		if (canRemove) {

			var source = that.children[0].getAttribute("source");
			var data = storage();

			if (e.which === 3 || that.children[0].getAttribute("class") === "block wiggly") return false;

			if (data.linknewtab) {

				chrome.tabs.create({
					url: source
				});

			} else {

				if (e.which === 2) {

					chrome.tabs.create({
						url: source
					});

				} else {

					id("hiddenlink").setAttribute("href", source);
					id("hiddenlink").setAttribute("target", "_self");
					id("hiddenlink").click();
				}
			}
		}
	}

	id("i_title").onkeypress = function(e) {
		if (e.which === 13) linkSubmission();
	}

	id("i_url").onkeypress = function(e) {
		if (e.which === 13) linkSubmission();
	}

	id("submitlink").onmouseup = function() {
		linkSubmission();
	}

	id("i_linknewtab").onchange = function() {

		if (this.checked) {
			storage("linknewtab", true);
			id("hiddenlink").setAttribute("target", "_blank");
		} else {
			storage("linknewtab", false);
			id("hiddenlink").setAttribute("target", "_blank");
		}
	}

	initblocks();
}

function weather() {

	function cacheControl() {

		var data = storage();
		var now = Math.floor(DATE.getTime() / 1000);
		var param = (data.weather ? data.weather : "");

		if (data.weather && data.weather.lastCall) {

			
			//si weather est vieux d'une demi heure (1800s)
			//ou si on change de lang
			//faire une requete et update le lastcall
			if (sessionStorage.lang || now > data.weather.lastCall + 1800) {

				request(param, "current");

				//si la langue a été changé, suppr
				if (sessionStorage.lang) sessionStorage.removeItem("lang");

			} else {

				dataHandling(param.lastState);
			}

			//high ici
			if (data.weather && data.weather.fcDay === (new Date).getDay()) {
				id("temp_max").innerText = data.weather.fcHigh + "°";
			} else {
				request(data.weather, "forecast");
			}

		} else {

			//initialise a Paris + Metric
			//c'est le premier call, requete + lastCall = now
			initWeather();
		}
	}

	
	function initWeather() {

		var param = {
			city: "Paris",
			ccode: "FR",
			location: false,
			unit: "metric"
		};

		navigator.geolocation.getCurrentPosition((pos) => {

			param.location = [];

			//update le parametre de location
			param.location.push(pos.coords.latitude, pos.coords.longitude);
			storage("weather", param);

			id("i_geol").checked = true;
			id("i_geol").removeAttribute("disabled");
			id("sett_city").setAttribute("class", "city hidden");

			storage("weather", param);

			request(param, "current");
			request(param, "forecast");
			
		}, (refused) => {

			param.location = false;

			//désactive geolocation if refused
			id("i_geol").checked = false;
			id("i_geol").removeAttribute("disabled");

			storage("weather", param);

			request(param, "current");
			request(param, "forecast");
		});
	}

	
	function request(arg, wCat) {

		
		function urlControl(arg, forecast) {

			var url = 'https://api.openweathermap.org/data/2.5/';


			if (forecast)
				url += "forecast?appid=" + atob(WEATHER_API_KEY[0]);
			else
				url += "weather?appid=" + atob(WEATHER_API_KEY[1]);


			//auto, utilise l'array location [lat, lon]
			if (arg.location) {
				url += "&lat=" + arg.location[0] + "&lon=" + arg.location[1];
			} else {
				url += "&q=" + encodeURI(arg.city) + "," + arg.ccode;
			}

			url += '&units=' + arg.unit + '&lang=' + localStorage.lang;

			return url;
		}

		
		function weatherResponse(parameters, response) {

			//sauvegarder la derniere meteo
			var now = Math.floor(DATE.getTime() / 1000);
			var param = parameters;
			param.lastState = response;
			param.lastCall = now;
			storage("weather", param);

			//la réponse est utilisé dans la fonction plus haute
			dataHandling(response);
		}

		
		function forecastResponse(parameters, response) {

			function findHighTemps(d) {
			
				var i = 0;
				var newDay = new Date(d.list[0].dt_txt).getDay();
				var currentDay = newDay;
				var arr = [];
				

				//compare la date toute les 3h (list[i])
				//si meme journée, rajouter temp max a la liste

				while (currentDay == newDay && i < 10) {

					newDay = new Date(d.list[i].dt_txt).getDay();
					arr.push(d.list[i].main.temp_max);

					i += 1;
				}

				var high = Math.floor(Math.max(...arr));

				//renvoie high
				return [high, currentDay];
			}

			var fc = findHighTemps(response);

			//sauvegarder la derniere meteo
			var param = parameters;
			param.fcHigh = fc[0];
			param.fcDay = fc[1];
			storage("weather", param);

			id("temp_max").innerText = param.fcHigh + "°";
		}

		var url = (wCat === "current" ? urlControl(arg, false) : urlControl(arg, true));

		var request_w = new XMLHttpRequest();
		request_w.open('GET', url, true);

		request_w.onload = function() {
			
			var resp = JSON.parse(this.response);

			if (request_w.status >= 200 && request_w.status < 400) {

				if (wCat === "current") {
					weatherResponse(arg, resp);
				}
				else if (wCat === "forecast") {
					forecastResponse(arg, resp);
				}

			} else {
				submissionError(resp.message);
			}
		}

		request_w.send();
	}	

	function dataHandling(data) {

		//si le soleil est levé, renvoi jour
		//le renvoie correspond au nom du répertoire des icones jour / nuit
		function dayOrNight(sunset, sunrise) {
			var ss = new Date(sunset * 1000);
			var sr = new Date(sunrise * 1000);

			if (HOURS > sr.getHours() && HOURS < ss.getHours()) {
				return "day";
			}
			else {
				return "night";
			}
		}

		//prend l'id de la météo et renvoie une description
		//correspond au nom de l'icone (+ .png)
		function imgId(id) {
			if (id >= 200 && id <= 232) {
				return "thunderstorm"
			} 
			else if (id >= 300 && id <= 321) {
				return "showerrain"
			}
			else if (id === 500 || id === 501) {
				return "lightrain"
			}
			else if (id >= 502 && id <= 531) {
				return "showerrain"
			}
			else if (id >= 602 && id <= 622) {
				return "snow"
			}
			else if (id >= 701 && id <= 781) {
				return "mist"
			}
			else if (id === 800) {
				return "clearsky"
			}
			else if (id === 801 || id === 802) {
				return "fewclouds"
			}
			else if (id === 803 || id === 804) {
				return "brokenclouds"
			}
		}

		//pour la description et temperature
		//Rajoute une majuscule à la description
		var meteoStr = data.weather[0].description;
		meteoStr = meteoStr[0].toUpperCase() + meteoStr.slice(1);
		id("desc").innerText = meteoStr + ".";


		//si c'est l'après midi (apres 12h), on enleve la partie temp max
		var dtemp, wtemp;

		if (HOURS < 12) {

			//temp de desc et temp de widget sont pareil
			dtemp = wtemp = Math.floor(data.main.temp) + "°";
			id("temp_max_wrap").setAttribute("class", "hightemp shown");

		} else {

			//temp de desc devient temp de widget + un point
			//on vide la catégorie temp max
			wtemp = Math.floor(data.main.temp) + "°";
			dtemp = wtemp + ".";
		}

		id("temp").innerText = dtemp;
		id("widget_temp").innerText = wtemp;
		
		if (data.icon) {

			id("widget").setAttribute("src", data.icon);
			
		} else {
			//pour l'icone
			var d_n = dayOrNight(data.sys.sunset, data.sys.sunrise);
			var weather_id = imgId(data.weather[0].id);
	 		var icon_src = "src/images/weather/" + d_n + "/" + weather_id + ".png";
	 		id("widget").setAttribute("src", icon_src);
		}

		id("widget").setAttribute("class", "w_icon shown");
	}

	function submissionError(error) {

		//affiche le texte d'erreur
		id("wrongCity").innerText = error;
		id("wrongCity").style.display = "block";
		id("wrongCity").style.opacity = 1;

		//l'enleve si le user modifie l'input
		id("i_city").onkeydown = function() {

			id("wrongCity").style.opacity = 0;
			setTimeout(function() {
				id("wrongCity").style.display = "none";
			}, 200);
		}
	}

	function updateCity() {

		var data = storage();
		var param = data.weather;

		param.ccode = id("i_ccode").value;
		param.city = id("i_city").value;

		if (param.city.length < 2) return false;

		request(param, "current");
		request(param, "forecast");

		id("i_city").setAttribute("placeholder", param.city);
		id("i_city").value = "";
		id("i_city").blur();

		storage("weather", param);	
	}

	function updateUnit(that) {

		var data = storage();
		var param = data.weather;

		if (that.checked) {
			param.unit = "imperial";
		} else {
			param.unit = "metric";
		}

		request(param, "current");
		request(param, "forecast");
		
		storage("weather", param);
	}

	function updateLocation(that) {

		var data = storage();
		var param = data.weather;
		param.location = [];

		if (that.checked) {

			that.setAttribute("disabled", "");

			navigator.geolocation.getCurrentPosition((pos) => {

				//update le parametre de location
				param.location.push(pos.coords.latitude, pos.coords.longitude);
				storage("weather", param);

				//request la meteo
				request(param, "current");
				request(param, "forecast");

				//update le setting
				id("sett_city").setAttribute("class", "city hidden");
				that.removeAttribute("disabled");
				
			}, (refused) => {

				//désactive geolocation if refused
				that.checked = false
				that.removeAttribute("disabled");

				if (!param.city) initWeather();
			});

		} else {

			id("sett_city").setAttribute("class", "city");

			id("i_city").setAttribute("placeholder", param.city);
			id("i_ccode").value = param.ccode;

			param.location = false;
			storage("weather", param);
			
			request(param, "current");
			request(param, "forecast");
		}
	}

	//TOUT LES EVENTS

	id("b_city").onmouseup = function() {
		if (!stillActive) {
			updateCity();
			slow(this);
		}
	}

	id("i_city").onkeypress = function(e) {
		if (!stillActive && e.which === 13) {
			updateCity();
			slow(this);
		}
	}

	id("i_units").onchange = function() {
		if (!stillActive) {
			updateUnit(this);
			slow(this);
		}
	}

	id("i_geol").onchange = function() {
		if (!stillActive) {
			updateLocation(this);
		}
	}

	cacheControl();
}

function imgCredits(src, type) {

	if (type === "default" || type === "dynamic") {
		id("credit").setAttribute("class", "visible");
	}
	if (type === "custom") {
		id("credit").setAttribute("class", "hidden");
		return false;
	}

	for (var i = 0; i < CREDITS.length; i++) {

		if (src && src.includes(CREDITS[i].id)) {
			id("credit").setAttribute("href", CREDITS[i].url);
			id("credit").innerText = CREDITS[i].title + ", " + CREDITS[i].artist;
			id("credit").removeAttribute("class");

			return true;
		}
	}
}

function imgBackground(val) {
	if (val) {
		id("background").style.backgroundImage = "url(" + val + ")";
	} else {
		return id("background").style.backgroundImage;
	}
}

function applyBackground(src, type, blur) {

	//enleve les inputs selectionnés suivent le type
	if (type === "default") {
		id("i_dynamic").checked = false;
		id("i_bgfile").value = "";
	}
	else if (type === "custom") {
		id("i_dynamic").checked = false;
		remSelectedPreview();
		imgCredits(null, type);
	}
	else if (type === "dynamic") {
		remSelectedPreview();
	}
	
	imgBackground(src);
	if (blur) blurThis(blur);
}
 
function initBackground() {

	var data = storage();

	//si storage existe, utiliser storage, sinon default
	var image = (data.background_image ? data.background_image : "src/images/backgrounds/avi-richards-beach.jpg");
	var type = (data.background_type ? data.background_type : "default");
	var blur = (Number.isInteger(parseInt(data.background_blur)) ? data.background_blur : 25);

	//si custom, faire le blob
	if (data.background_type === "custom") {
		//reste local !!!!
		applyBackground(blob(data.background_blob), type);	
	} 
	else if (data.background_type === "dynamic") {
		dynamicBackground("init")
	}
	else {
		applyBackground(image, type);
	}
	
	imgCredits(image, type);
	blurThis(blur, true);

	//remet les transitions du blur
	setTimeout(function() {
		id("background").style.transition = "filter .2s";
	}, 500);
}

function blob(donnee, set) {

	//fonction compliqué qui créer un blob à partir d'un base64
	const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
		const byteCharacters = atob(b64Data);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		const blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	//découpe les données du file en [contentType, base64data]
	let base = (set ? donnee.split(",") : donnee);
	let contentType = base[0].replace("data:", "").replace(";base64", "");
	let b64Data = base[1];

	//creer le blob et trouve l'url
	let blob = b64toBlob(b64Data, contentType);
	let blobUrl = URL.createObjectURL(blob);

	if (set) {

		//enregistre l'url et applique le bg
		//blob est local pour avoir plus de place
		storage("background_blob", base); //reste local !!!!
		storage("background_image", blobUrl);
		storage("background_type", "custom");

	}

	return blobUrl;
}

function renderImage(file) {

	// render the image in our view
	// ces commentaire anglais ne veulent pas dire que j'ai copié collé ok

	// generate a new FileReader object
	var reader = new FileReader();

	// inject an image with the src url
	reader.onload = function(event) {

		applyBackground(blob(event.target.result, true), "custom");
	}

	// when the file is read it triggers the onload event above.
	reader.readAsDataURL(file);
}

function defaultBg() {

	var bgTimeout, oldbg;

	id("default_background").onmouseenter = function() {
		oldbg = imgBackground().slice(4, imgBackground().length - 1);
	}

	id("default_background").onmouseleave = function() {
		clearTimeout(bgTimeout);
		imgBackground(oldbg);
	}

	function getSource(that) {
		var src = that.children[0].getAttribute("src");
		if (id("i_retina").checked) src = src.replace("/backgrounds/", "/backgrounds/4k/");
		if (!id("i_retina").checked) src = src.replace("/4k", "");

		return src
	}

	function imgEvent(state, that) {

		if (state === "enter") {
			if (bgTimeout) clearTimeout(bgTimeout);

			var src = getSource(that);

			bgTimeout = setTimeout(function() {

				//timeout de 300 pour pas que ça se fasse accidentellement
				//prend le src de la preview et l'applique au background
				imgBackground(src);

			}, 300);

		} else if (state === "leave") {

			clearTimeout(bgTimeout);

		} else if (state === "mouseup") {

			var src = getSource(that);

		    applyBackground(src, "default");
		    imgCredits(src, "default");

			clearTimeout(bgTimeout);
			oldbg = src;

			//enleve selected a tout le monde et l'ajoute au bon
			remSelectedPreview();
			//ici prend les attr actuels et rajoute selected après (pour ioswallpaper)
			var tempAttr = that.getAttribute("class");
			that.setAttribute("class", tempAttr + " selected");

			storage("background_image", src);
			storage("background_type", "default");
		}
	}

	var imgs = cl("imgpreview");
	for (var i = 0; i < imgs.length; i++) {

		imgs[i].onmouseenter = function() {imgEvent("enter", this)}
		imgs[i].onmouseleave = function() {imgEvent("leave", this)}
		imgs[i].onmouseup = function() {imgEvent("mouseup", this)}
	}
}
defaultBg();

function retina(check) {

	var b = id("background").style.backgroundImage.slice(4, imgBackground().length - 1);

	if (!check && b.includes("/4k")) {
		b = b.replace("/4k", "");
		imgBackground(b);
		storage("background_image", b);
		storage("retina", false);
	}

	if (check && !b.includes("/4k")) {
		b = b.replace("backgrounds/", "backgrounds/4k/");
		imgBackground(b);
		storage("background_image", b);
		storage("retina", true);
	}
}

function remSelectedPreview() {
	let a = cl("imgpreview");
	for (var i = 0; i < a.length; i++) {

		if (a[i].classList[1] === "selected")
			a[i].setAttribute("class", "imgpreview")
	}
}

function dynamicBackground(state, input) {

	function apply(condition, init) {

		var data = storage();

		if (condition) {

			if (!init) {
				//set un previous background si le user choisi de désactiver ce parametre
				storage("previous_type", data.background_type);
				storage("dynamic", true);
				storage("background_type", "dynamic");
			}

			applyBackground(UNSPLASH, "dynamic");
			imgCredits(UNSPLASH, "dynamic");

			//enleve la selection default bg si jamais
			remSelectedPreview();

		} else {

			storage("dynamic", false);
			storage("background_type", data.previous_type);

			initBackground();
			imgCredits(data.background_image, data.background_type);
		}	
	}

	
	if (state === "init") {
		apply(true, true);
	} else {
		apply(input)
	}	
}

function blurThis(val, init) {
	
	if (val > 0) {
		id('background').style.filter = 'blur(' + val + 'px)';
	} else {
		id('background').style.filter = '';
	}

	if (!init) storage("background_blur", val);
	else id("i_blur").value = val;
}

function darkmode(choix) {

	
	function isIOSwallpaper(dark) {

		//défini les parametres a changer en fonction du theme
		var modeurl, actual, urltouse;

		if (dark) {

			modeurl = "ios13_dark";
			actual = "ios13_light";
			urltouse = 'src/images/backgrounds/ios13_dark.jpg';

		} else {
			
			modeurl = "ios13_light";
			actual = "ios13_dark";
			urltouse = 'src/images/backgrounds/ios13_light.jpg';
		}

		//et les applique ici
		id("ios_wallpaper").children[0].setAttribute("src", "src/images/backgrounds/" + modeurl + ".jpg");

		if (imgBackground().includes(actual)) {

			applyBackground(urltouse, "default");
			storage("background_image", urltouse);
		}
	}

	
	function applyDark(add, system) {

		if (add) {

			if (system) {

				document.body.setAttribute("class", "autodark");

			} else {

				document.body.setAttribute("class", "dark");
				isIOSwallpaper(true);
			}

		} else {

			document.body.removeAttribute("class");
			isIOSwallpaper(false);
		}
	}

	
	function auto(weather) {

		var data = storage();

		var ls = data.weather.lastState;
		var sunrise = new Date(ls.sys.sunrise * 1000);
		var sunset = new Date(ls.sys.sunset * 1000);
		var hr = new Date();

		sunrise = sunrise.getHours() + 1;
		sunset = sunset.getHours();
		hr = hr.getHours();

		if (hr < sunrise || hr > sunset) {
			applyDark(true);
		} else {
			applyDark(false);
		}
	}

	
	function initDarkMode() {

		var data = storage();

		var dd = (data.dark ? data.dark : "disable");

		if (dd === "enable") {
			applyDark(true);
		}

		if (dd === "disable") {
			applyDark(false);
		}

		if (dd === "auto") {
			auto();
		}

		if (dd === "system") {
			applyDark(true, true);
		}	
	}

	
	function changeDarkMode() {

		if (choix === "enable") {
			applyDark(true);
			storage("dark", "enable");
		}

		if (choix === "disable") {
			applyDark(false);
			storage("dark", "disable");
		}

		if (choix === "auto") {

			//prend l'heure et ajoute la classe si nuit
			auto();
			storage("dark", "auto");
		}

		if (choix === "system") {
			storage("dark", "system");
			applyDark(true, true);
		}
	}

	if (choix) {
		changeDarkMode();
	} else {
		initDarkMode();
	}
}

function searchbarFlexControl(activated, linkslength) {

	if (linkslength > 0) {

		if (activated)
			id("sb_container").setAttribute("class", "shown");
		else
			id("sb_container").setAttribute("class", "removed");
		
	} else {

		if (activated)
			id("sb_container").setAttribute("class", "shown");
		else
			id("sb_container").setAttribute("class", "removed");
	}
}

function searchbar() {

	
	function activate(activated, links) {

		//visibility hidden seulement si linkblocks est vide

		var data = storage();

		if (activated) {	

			id("choose_searchengine").setAttribute("class", "shown");

			searchbarFlexControl(activated, (links ? links.length : 0));
			data.searchbar = true;
			
		} else {

			//pour animer un peu
			id("choose_searchengine").setAttribute("class", "hidden");
			
			searchbarFlexControl(activated, (links ? links.length : 0));
			data.searchbar = false;
		}

		localStorage.data = JSON.stringify(data);
	}

	function chooseSearchEngine(choice) {

		var engines = {
			"s_startpage" : ["https://www.startpage.com/do/dsearch?query=", "Startpage"],
			"s_ddg" : ["https://duckduckgo.com/?q=", "DuckDuckGo"],
			"s_qwant" : ["https://www.qwant.com/?q=", "Qwant"],
			"s_ecosia" : ["https://www.ecosia.org/search?q=", "Ecosia"],
			"s_google" : ["https://www.google.com/search", "Google"],
			"s_yahoo" : ["https://search.yahoo.com/search?p=", "Yahoo"],
			"s_bing" : ["https://www.bing.com/search?q=", "Bing"]
		}

		var trad = {
			en: "Search",
			fr: "Rechercher sur",
			sv: "Sök med",
			nl: "Zoek op",
			pl: "Szukaj z",
			ru: "Поиск в",
			zh_CN: "搜索"
		}

		var placeholder = "";

		if (localStorage.lang) {
			placeholder = trad[localStorage.lang] + " " + engines[choice][1];
		} else {
			placeholder = trad["en"] + " " + engines[choice][1];
		}

		id("sb_form").setAttribute("action", engines[choice][0]);
		id("searchbar").setAttribute("placeholder", placeholder);

		data.searchbar_engine = choice;
		localStorage.data = JSON.stringify(data);
	}

	
	//init
	var data = storage();

	if (data.searchbar) {

		//display
		activate(true, data.links);

		if (data.searchbar_engine) {
			chooseSearchEngine(data.searchbar_engine);
		} else {
			chooseSearchEngine("s_startpage");
		}

	} else {
		activate(false, data.links);
	}

	// Active ou désactive la search bar
	id("i_sb").onchange = function() {

		if (!stillActive) {
			activate(this.checked);
		}
		slow(this);
	}

	// Change le moteur de recherche de la search bar selon le select .choose_search
	id("i_sbengine").onchange = function() {
		chooseSearchEngine(this.value);
	}
}

// Signature aléatoire
function signature() {
	var v = "<a href='https://victor-azevedo.me/'>Victor Azevedo</a>";
	var t = "<a href='https://tahoe.be'>Tahoe Beetschen</a>";
	var e = document.createElement("span");

	e.innerHTML = (Math.random() > 0.5 ? (v + " & " + t) : (t + " & " + v));
	id("rand").appendChild(e);
}

//localized
function actualizeStartupOptions() {

	let data = JSON.parse(localStorage.data);

	if (data.linknewtab) {
		id("i_linknewtab").checked = true;
	} else {
		id("i_linknewtab").checked = false;
	}

	//default background

	var imgs = cl("imgpreview");
	var bgURL = id("background").style.backgroundImage;
	var previewURL = "";	

	for (var i = 0; i < imgs.length; i++) {
		
		previewURL = imgs[i].children[0].getAttribute("src");

		if (bgURL.includes(previewURL)) {
			imgs[i].setAttribute("class", "imgpreview selected");
		}
	}

	if (data.retina) {
		id("i_retina").checked = true;
	} else {
		id("i_retina").checked = false;
	}

	//dynamic background
	if (data.background_type === "dynamic") {
		id("i_dynamic").checked = true;
	}

	//dark mode input
	if (data.dark) {
		id("i_dark").value = data.dark;
	} else {
		id("i_dark").value = "disable";
	}
	
	
	//weather city input
	if (data.weather && data.weather.city) {
		id("i_city").setAttribute("placeholder", data.weather.city);
	} else {
		id("i_city").setAttribute("placeholder", "City");
	}


	if (data.weather && data.weather.ccode) {
		id("i_ccode").value = data.weather.ccode;
	} else {
		id("i_ccode").value = "US";
	}

	//check geolocalisation
	//enleve city
	if (data.weather && data.weather.location) {

		id("i_geol").checked = true;
		id("sett_city").setAttribute("class", "city hidden");

	} else {

		id("i_geol").checked = false;
	}

	//check imperial
	if (data.weather && data.weather.unit === "imperial") {
		id("i_units").checked = true;
	} else {
		id("i_units").checked = false;
	}

	
	//searchbar switch et select
	if (data.searchbar) {
		id("i_sb").checked = true;
		setTimeout(() => {
	    	id("searchbar").focus();
	    }, 100);
	} else {
		id("i_sb").checked = false;
	}	
	

	if (data.searchbar_engine) {
		id("i_sbengine").value = data.searchbar_engine;
	} else {
		id("i_sbengine").value = "s_startpage";
	}


	//clock
	if (data.clockformat === 12) {
		id("i_ampm").checked = true;
		localStorage.clockformat = 12;
	} else {
		id("i_ampm").checked = false;
	}
		

	//langue
	if (localStorage.lang) {
		id("i_lang").value = localStorage.lang;
	} else {
		id("i_lang").value = "en";
	}	
}

function mobilecheck() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}

window.onload = function() {
	traduction();
	darkmode();
	clock();
	date();
	greetings();
	weather();
	searchbar();
	quickLinks();
	signature();
	actualizeStartupOptions();
	initBackground();

	document.body.style.animation = "fade .1s ease-in forwards";
}