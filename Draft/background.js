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