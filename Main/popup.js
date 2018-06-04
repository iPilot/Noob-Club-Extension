///<reference path="jquery.min.js"/>
//chrome.storage.local.clear();

var MAX_LINES = 25;

chrome.storage.local.get(null, function (result) {
	var votes = "";
	var v = [];
	var now = new Date();
	var diff = 72 * 60 * 60 * 1000;
	for (item in result) {
		var d = new Date(result[item]);
		if (now - d > diff)
			chrome.storage.local.remove(item);
		else
			v.push({ name: item, date: d });
	}
	v.sort(function(a, b) {
		if (a.date > b.date)
			return -1;
		if (a.date < b.date)
			return 1;
		return 0;
    });
	var len = Math.min(MAX_LINES, v.length);
	var place = document.getElementsByClassName("votes")[0];
	for (var i = 0; i < len; i++)
	{
		
		var line = "<div class=\"vote_line\">";
		line += "<div class=\"name\">" + v[i].name + "</div>";
		line += "<div class=\"date\">" + formatDate(v[i].date) + "</div></div>";
		votes += line;
	}
	votes += "</div>";
	place.innerHTML = votes;
});

function formatDate(date) {
	var d = new Date(date);
	var now = new Date();
	var delta = Math.abs(now - d);
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