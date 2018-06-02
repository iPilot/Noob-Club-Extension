chrome.storage.local.get(null, function(items) {
	var now = new Date();
	var diff = 72 * 60 * 60 * 1000;
	for (item in items)
	{
		var date = new Date(items[item]);
		if (now - date > diff)
			chrome.storage.local.remove(item);
	}
});

chrome.storage.local.set({
	'User 1': new Date(2018, 5, 1, 10, 43, 0).toString(),
	'User 2': new Date(2018, 5, 1, 12, 16, 0).toString(),
	'User 3': new Date(2018, 5, 1, 13, 22, 0).toString(),
	'User 4': new Date(2018, 5, 1, 15, 39, 0).toString(),
});

 //chrome.browserAction.onClicked.addListener(function() {
	// var date = new Date();
	// var date2 = new Date();
	// date2.setDate(date.getDate() + 3);
	// chrome.storage.local.set({
	//	 'iPilot': date.toString(),
	//	 'Test': date2.toString()
	//	 }, function() { 
	//	 console.log('Added ' + date2);
	// });
 //});