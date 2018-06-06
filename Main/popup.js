///<reference path="jquery.min.js"/>
//chrome.storage.local.clear();

/**chrome.storage.local.get(null, function (obj) {
	var new_obj = {};
	for (item in obj) {
		/**var d = new Date(obj[item]);//.getMilliseconds();
		new_obj[item] = d;
		//chrome.storage.local.remove(item); //
		console.log(item);
	}
	chrome.storage.local.set(new_obj); 
});  //*/

var MAX_LINES = 25;

function formatTimespanPast(delta) {
	var second = 1000;
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;
	if (delta > day)
		return Math.trunc(delta / day) + ' д. назад';
	if (delta > hour)
		return Math.trunc(delta / hour) + ' ч. назад';
	if (delta > minute)
		return Math.trunc(delta / minute) + ' мин. назад';
	return Math.trunc(delta / second) + ' с. назад';
}

$(document).ready(function () {
	chrome.storage.local.get("current_user", function (obj) {
		if (!$.isEmptyObject(obj)) {
			document.getElementById("user_name").innerText = obj["current_user"];
		}
	});
	chrome.storage.local.get(null, function (result) {
		var votes = "";
		var v = [];
		var now = new Date();
		var diff = 72 * 60 * 60 * 1000;
		for (item in result) {
			if (item.substring(0, 7) == 'voting_') {
				var d = now.getTime() - result[item];
				if (d > diff)
					chrome.storage.local.remove(item);
				else
					v.push({ name: item.substring(7), date: d });
			}
		}
		v.sort(function (a, b) {
			if (a.date > b.date)
				return 1;
			if (a.date < b.date)
				return -1;
			return 0;
		});
		var len = Math.min(MAX_LINES, v.length);
		var place = document.getElementsByClassName("votes")[0];
		for (var i = 0; i < len; i++) {
			var line = $('<div/>').addClass('vote_line'); 
			$('<div/>').addClass('name').html(v[i].name).appendTo(line);
			$('<div/>').addClass('date').html(formatTimespanPast(v[i].date)).appendTo(line);
			line.appendTo(place);
		}
	});
});