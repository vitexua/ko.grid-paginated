(function () {
	ui.ajax = {};

	ui.ajax.list = {};

	$.ajaxSetup({
	    type: 'POST',
	    contentType : 'application/json',
	    dataType: 'json',
	    timeout: 600000
	});

	amplify.request.define("Controller1List", "ajax", { url: "/api", type: "POST" });

	ui.ajax.list.load = function(list, callback) {
		amplify.request('Controller1List',
			JSON.stringify([[list.ajaxMethod, {
				count: list.perPage(),
				start: (list.pageIndex() * list.perPage() - list.perPage())
			}]]),
			function(resp){
				callback(resp[0].result);
			}
		);
	};

}).apply(ui);