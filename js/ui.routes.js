(function(){
	ui.routes = {};
	ui.routes.set = function(hash) {
		document.location.hash = hash;
	};
	ui.routes.get = function() {
		return document.location.hash;
	};
	ui.routes.init = function() {
		var AppRouter = Backbone.Router.extend({
		    routes: {
		    	"menu1": "menu1",
		    	"menu1/:id": "menu1Id",
		    },
	    	menu1: function(id) {
	    		App.ViewModel.menu1.load();
		    },
		    menu1Id: function(id) {
		    	if(App.ViewModel.menu1.list().length > 0) {
		    		App.ViewModel.menu1.showItem(id);
		    	} else {
			    	App.ViewModel.menu1.load(function(){
			    		setTimeout(function(){
			    			App.ViewModel.menu1.showItem(id);
			    		}, 100);			    		
			    	});
		    	}
		    },
		});

		ui.routes.router = new AppRouter;

		Backbone.history.start();
	};
}).apply(ui.routes);