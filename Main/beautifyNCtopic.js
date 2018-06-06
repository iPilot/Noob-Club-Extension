///<reference path="jquery.min.js"/>

function formatTimespanFuture(date) {
	var second = 1000;
	var minute = second * 60;
	var hour = minute * 60;
	var day = hour * 24;
	var d = new Date(date + 3 * day);
	var delta = d - new Date().getTime();
	var time;
	if (delta > day)
		time = Math.trunc(delta / day) + ' д.';
	else if (delta > hour)
		time = Math.trunc(delta / hour) + ' ч.';
	else if (delta > minute)
		time = Math.trunc(delta / minute) + ' мин.';
	else time = Math.trunc(delta / second) + ' сек.';
	return { short: time, full: "Будет доступно через " + time };
}

function checkQuote(selection) {
	var start = selection.parentElement.closest('div[class$=inner]');
	var end = selection.focusNode.parentElement.closest('div[class$=inner]');
	return start && end && start.id && end.id && start.id == end.id;
}

function getPosterName(post) {
	var user = post.getElementsByClassName("poster");
	return user[0].getElementsByTagName("a")[0].firstChild.textContent
}

function getVotingElement(post) {
	return post.getElementsByClassName("message_voting")[0].children[0]
}

function addToStorage(user_name) {
	var now = (new Date()).getTime();
	var obj = {};
	obj[user_name] = now;
	chrome.storage.local.set(obj);
}

function addTostorageWithMsgNum(user_name, msgNum) {
	var now = (new Date()).getTime();
	var obj = {};
	obj[user_name] = { date: now, msgNum: msgNum };
	chrome.storage.local.set(obj);
}

function getMsgNum(post) {
}

function checkVotes(post) {
	var user_name = getPosterName(post);
	var voting = getVotingElement(post);
	if (voting.className == "vote_message vote_plus") {
		chrome.storage.local.get('voting_' + user_name, function (obj) {
			if (!$.isEmptyObject(obj)) {
				voting.style.display = 'none';
				var text = formatTimespanFuture(obj['voting_' + user_name]);
				$('<span/>', { style: "color:#f00;padding-right:5px;", title: text.full })
					.html("[" + text.short + "]")
					.insertAfter(voting);
			}
			else {
				voting.onclick = function () {
					addToStorage('voting_' + user_name);
				};
			}
		});
	}
}

function addToIgnoreList(user_name) {
	addToStorage("ignore_" + user_name);
	location.reload();
}

function addIgnoreLink(post) {
	var report = post.getElementsByClassName('smalltext reportlinks')[0];
	var poster = getPosterName(post);
	var b = $("<span> | </span>");
	var ig = $("<a/>", {
		html: "Игнорировать",
		href: "javascript: void(0)"
	});
	ig.insertAfter(report.firstElementChild);
	report.children[1].onclick = function () {
		addToIgnoreList(poster);
	};
	b.insertAfter(report.firstElementChild);
}

function checkIgnored(post) {
	var poster = getPosterName(post);
	chrome.storage.local.get('ignore_' + poster, function (obj) {
		if ($.isEmptyObject(obj) || isTopicStart(post))
			return;
		post.style.display = 'none';
	});
}

function isTopicStart(post) {
	var ans = post.getElementsByClassName("smalltext")[1];
	return ans.firstElementChild.textContent.search("Ответ") == -1;
}

function beautiftOverquoting(post) {
	var innerQuotes = $(".bbc_alternate_quote");
	innerQuotes.css("display", "none");
	for (var i = 0; i < innerQuotes.length; i++) {
		innerQuotes[i].previousElementSibling.style.display = 'none';
		var next = innerQuotes[i].nextElementSibling;
		next.style.display = 'none';
		next.nextElementSibling.style.display = 'none';
	}
}

function togglePostStyle(post) {
	post.classList.toggle("windowbg");
	post.classList.toggle("windowbg2");
}

function processPosts(postClass, current_user) {
	var posts = $(postClass);
	for (var i = 0; i < posts.length; i++) {
		checkIgnored(posts[i]);
		if (current_user)
			checkVotes(posts[i]);
		addIgnoreLink(posts[i]);
		beautiftOverquoting(posts[i]);
	}	
}

function getUser() {
	if (document.getElementById("guest_form"))
		return null;
	return document.getElementsByClassName("user")[0].firstElementChild.textContent;
}

chrome.storage.local.get(null, function (items) {
	var now = new Date();
	var diff = 72 * 60 * 60 * 1000;
	for (item in items) {
		if (items[item] - now.getTime() > diff) {
			chrome.storage.local.remove(item);
		}
	}
	var current_user = getUser();
	chrome.storage.local.set({ current_user: current_user });
	processPosts(".windowbg", current_user);
	processPosts(".windowbg2", current_user);
});



