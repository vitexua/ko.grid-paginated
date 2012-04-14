var App = {};

(function(){
	$(document).ready(function() {
		App.ViewModel = new function() {};

		App.ViewModel.menu1 = new ui.view.list({
			id: 'menu1-grid',
			localMode: true,
			dataFormat: 'object',
			listSearchableFields: ['name', 'title'],
			listSortableField: 'name',
			ajaxMethod: 'Controller1::list',
			storeFields: ['id', 'name', 'title'],
			perPage: 10
		});
		App.ViewModel.menu1.loadData([
			{id: 1, name: 'name1', title: 'title'},
			{id: 2, name: 'name2', title: 'title'},
			{id: 3, name: 'name3', title: 'title'},
			{id: 4, name: 'name4', title: 'title'},
			{id: 5, name: 'name5', title: 'title'},
			{id: 6, name: 'name6', title: 'title'},
			{id: 7, name: 'name7', title: 'title'},
			{id: 8, name: 'name8', title: 'title'},
			{id: 9, name: 'name9', title: 'title'},
			{id: 10, name: 'name10', title: 'title'},
			{id: 11, name: 'name11', title: 'title'},
			{id: 12, name: 'name12', title: 'title'},
			{id: 13, name: 'name13', title: 'title'},
			{id: 14, name: 'name14', title: 'title'},
			{id: 15, name: 'name15', title: 'title'},
			{id: 16, name: 'name16', title: 'title'},
			{id: 17, name: 'name17', title: 'title'},
			{id: 18, name: 'name18', title: 'title'},
			{id: 19, name: 'name19', title: 'title'},
			{id: 20, name: 'name20', title: 'title'},
			{id: 21, name: 'name21', title: 'title'},
			{id: 22, name: 'name22', title: 'title'}
		]);
		App.ViewModel.menu1.load();

	    ko.applyBindings(App.ViewModel);

	    ui.routes.init();
	});
}).apply(App);