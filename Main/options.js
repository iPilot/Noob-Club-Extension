///<reference path="jquery.min.js"/>

function hideAndRemove(list, user) {
	list.lastElementChild.onclick = function () {
		chrome.storage.local.remove(user);
		this.style.display = 'none';
	}
}

$(document).ready(function () {
	chrome.storage.local.get(null, function (obj) {
		for (item in obj) {
			if (item.substring(0, 7) == 'ignore_') {
				var d = $("<div/>", {
					class: "ignore_line",
					html: item.substring(7) + " ",
					height: 40
				});
				var b = $("<button/>", {
					html: "Удалить",
					width: 100,
					onclick: "chrome.storage.local.remove('" + item + "'); this.style.display = 'none';"
				});
				b.appendTo(d);
				var list = document.getElementById("ignore_list");
				d.appendTo(list);
				hideAndRemove(list, item);
			}
		}
	});
});

