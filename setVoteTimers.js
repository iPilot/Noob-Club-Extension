function formatDate(date) {
	var d = new Date(date);
	d.setDate(d.getDate() + 3);
	var delta = d - new Date();
	var second = 1000;
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var two_days = day * 2;
	var result = "Будет доступно через ";
	if (delta > two_days)
		return result + '2 дня';
	if (delta > day)
		return result + 'день';
	if (delta > hour)
		return result + Math.trunc(delta / hour) + ' ч.';
	if (delta > minute)
		return result + Math.trunc(delta / minute) + ' мин.';
	return result + Math.trunc(delta / second) + ' сек.';
}

chrome.storage.local.get(null, function (items) {
	var now = new Date();
	var diff = 72 * 60 * 60 * 1000;
	for (item in items) {
		var date = new Date(items[item]);
		if (now - date > diff) {
			chrome.storage.local.remove(item);
		}
	}
});

function processPost(posts, index) {
	var user = posts[index].getElementsByClassName("poster");
	var user_name = user[0].getElementsByTagName("a")[0].firstChild.textContent;
	var voting = posts[index].getElementsByClassName("message_voting")[0].children[0];
	if (voting.className == "vote_message vote_plus") {
		voting.onclick = function () {
			var now = (new Date()).toString();
			var obj = {};
			obj[user_name] = now;
			chrome.storage.local.set(obj);
		};
		chrome.storage.local.get(user_name, function (obj) {
			for (f in obj) {
				voting.style.visibility = "hidden";
			}
		});
	}
	else {
	}
}

function process(elementClass) {
	var posts = document.getElementsByClassName(elementClass);
	for (var i = 0; i < posts.length; i++) {
		processPost(posts, i);
	}
}

process("windowbg");
process("windowbg2");
process("i_am_good windowbg");