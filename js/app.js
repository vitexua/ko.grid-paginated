var App = {};

(function(){
	$(document).ready(function() {
		App.ViewModel = new function() {};

		App.ViewModel.menu1 = new ui.view.list({
			id: 'menu1-grid',
			localMode: true,
			listSearchableFields: ['name'],
			listSortableField: 'name',
			// ajaxMethod: 'Controller1::list',
			storeFields: ['id', 'name'],
			perPage: 10
		});
		App.ViewModel.menu1.loadData([
			[1, 'name1'],
			[2, 'name2'],
			[3, 'name3'],
			[4, 'name4'],
			[5, 'name5'],
			[6, 'name6'],
			[7, 'name7'],
			[8, 'name8'],
			[9, 'name9'],
			[10, 'name10'],
			[11, 'name11'],
			[12, 'name12'],
			[13, 'name13'],
			[14, 'name14'],
			[15, 'name15'],
			[16, 'name16'],
			[17, 'name17'],
			[18, 'name18'],
			[19, 'name19'],
			[20, 'name20'],
			[21, 'name21'],
			[22, 'name22']
		]);
		App.ViewModel.menu1.load();

	    ko.applyBindings(App.ViewModel);
	});
}).apply(App);