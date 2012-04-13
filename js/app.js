var App = {};

$(document).ready(function() {
	App.ViewModel = new function() {};

	App.ViewModel.menu1 = new ui.view.list();

	App.ViewModel.menu1.listSearchableFields = ['name'];
	App.ViewModel.menu1.listSortableField = 'name';
	App.ViewModel.menu1.loadData([
		{id: 1, name: 'name1'},
		{id: 2, name: 'name2'},
		{id: 3, name: 'name3'},
		{id: 4, name: 'name4'},
		{id: 5, name: 'name5'},
		{id: 6, name: 'name6'},
		{id: 7, name: 'name7'},
		{id: 8, name: 'name8'},
		{id: 9, name: 'name9'},
		{id: 10, name: 'name10'},
		{id: 11, name: 'name11'},
		{id: 12, name: 'name12'},
		{id: 13, name: 'name13'},
		{id: 14, name: 'name14'},
		{id: 15, name: 'name15'},
		{id: 16, name: 'name16'},
		{id: 17, name: 'name17'},
		{id: 18, name: 'name18'},
		{id: 19, name: 'name19'},
		{id: 20, name: 'name20'},
		{id: 21, name: 'name21'},
		{id: 22, name: 'name22'}
	]);

    ko.applyBindings(App.ViewModel);
});