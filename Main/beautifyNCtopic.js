///<reference path="jquery.min.js"/>

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

function getPosterName(post) {
	var user = post.getElementsByClassName("poster");
	return user[0].getElementsByTagName("a")[0].firstChild.textContent
}

function getVotingElement(post) {
	return post.getElementsByClassName("message_voting")[0].children[0]
}

function addToStorage(user_name) {
	var now = (new Date()).toString();
	var obj = {};
	obj[user_name] = now;
	chrome.storage.local.set(obj);
}

function addTostorageWithMsgNum(user_name, msgNum) {
	var now = (new Date()).toString();
	var obj = {};
	obj[user_name] = { date: now, msgNum: msgNum };
	chrome.storage.local.set(obj);
}

function addToStorageVoteInfo(user_name) {
	addToStorage(user_name + 'Vote');
}

function getMsgNum(post) {

}

function hideVoteButton(button, obj) {
	
}

function processPost(post) {
	var user_name = getPosterName(post);
	var voting = getVotingElement(post);
	if (voting.className == "vote_message vote_plus") {
		voting.onclick = function () {
			addToStorage(user_name);
		};
		chrome.storage.local.get(user_name, function (obj) {
			if (!$.isEmptyObject(obj))
				voting.style.visibility = "hidden";
		});
	}
	else {
	}
}

function processPosts(postClass) {
	var posts = document.getElementsByClassName(postClass);
	for (var i = 0; i < posts.length; i++) {
		processPost(posts[i]);
	}
}

processPosts("windowbg");
processPosts("windowbg2");
processPosts("i_am_good windowbg");