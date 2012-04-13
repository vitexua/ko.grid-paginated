ui.view = ui.view || {};
ui.view.list = function() {
	var self = this;

	this._higlighRemoveAll = function() {
		$('tr').removeClass('row-selected');
	};
	this._higlighRow = function(id) {
		id && $('tr.itemid_' + id).addClass('row-selected');
	};
	this._unhighlighRow = function(id) {
		id && $('tr.itemid_' + id).removeClass('row-selected');
	};
    this._clearAllChecked = function(status) {
    	status = status || false;
		!status && _.each(self.list(), function(item){
			item.checked(status);
		});
		status && _.each(self.filteredListPagged(), function(item){
			item.checked(status);
		});
    };

	this.ItemModel = function (data) {
		data = data || {};
		var _itemModel = this;
		this.checked = ko.observable(false).extend({ throttle: 1 });
		this.checked.subscribe(function(){
			if(_itemModel.checked()) {
				self._higlighRow(_itemModel.id());
				self.checkedItemsNumber(self.checkedItemsNumber()+1);
			} else {
				self._unhighlighRow(_itemModel.id());
				self.checkedItemsNumber(self.checkedItemsNumber()-1);
			}
		});
		this.id = ko.observable(data.id);
		this.name = ko.observable(data.name);
	};

	this.collection = ko.observableArray([]);
	this.editItem = ko.observable(new self.ItemModel());
	this.viewItem = ko.observable(new self.ItemModel());
	this.viewItem.subscribe(function(){		
		self._higlighRow(self.viewItem().id());
	});


	this.localSearch = ko.observable();

	this.options = {
		perPage: 10
	};

    this.pageIndex = ko.observable(1).extend({ throttle: 2 });
    this.pageIndex.subscribe(function(){
    	self._clearAllChecked();
    	self.checkedAll(false);
    });
    this.perPage = ko.observable(self.options.perPage);

	this.listSortableField = undefined;
    this.list = ko.observableArray([]);
    this.sort = function(field) {
    	field = self.listSortableField || 'id';
        self.list().sort(function(a, b){
            if(ui._toLowerCase(a[field]()) == ui._toLowerCase(b[field]())){
                return 0;
            }
            return (ui._toLowerCase(a[field]()) < ui._toLowerCase(b[field]())) ? -1 : 1;
        });
    };

	this.listSearchableFields = [];
	this.filteredList = ko.dependentObservable(function() {
        self.sort();
        var filter = self.localSearch();
        if (!filter || filter.toString().length < 1) {
            return self.list();
        } else {
            filter = filter.toLowerCase();
            var _searchFields = self.listSearchableFields;

            var results = ko.utils.arrayFilter(self.list(), function(item) {
                var result = false;
                _.each(_searchFields, function(field){
                    if(item[field]() && item[field]().toLowerCase().indexOf(filter) != -1) {
                        result = true;
                    }
                });                    
                return result;
            });
            return results;
            
        }
    }, self).extend({ throttle: 2 });

    self.pages = ko.dependentObservable(function(){
    	return Math.floor( self.filteredList().length / self.perPage() ) || 1;
    }).extend({ throttle: 1 });

    self.filteredListPagged = ko.dependentObservable(function() {
        return self.filteredList().slice(self.pageIndex() * self.perPage() - self.perPage(), self.pageIndex() * self.perPage());
    }).extend({ throttle: 3 });

	this.mode = ko.observable('list');
	this.mode.subscribe(function(){
		if(self.mode() == 'create') {
			self.editItem(new self.ItemModel());
		}
	});

    this.add = function() {
    	self.list.push(self.editItem());
    	self.viewItem(self.editItem())
    	self.editItem(new self.ItemModel());
    	self.mode('view');
    };

    this.save = function() {
    	_.each(self.list(), function(item, index){
    		if(item.id() == self.editItem().id()) {
    			self.list[index] = self.editItem();
    			self.openItem(self.editItem().id());
    		}
    	});
    };

    this.setPage = function(newIndex) {
    	self.pageIndex(newIndex);
    };
    this.setPrevPage = function() {
    	if(self.pageIndex() > 1) {
    		self.pageIndex(self.pageIndex() - 1);
    	}
    };
    this.setNextPage = function() {
    	if(self.pageIndex() < self.pages()) {
    		self.pageIndex(self.pageIndex() + 1);
    	}
    };

	this.checkedAll = ko.observable(false).extend({ throttle: 1 });
	this.checkedAll.subscribe(function(){
		self._clearAllChecked(self.checkedAll());
	});
    this.checkedItemsNumber = ko.observable(0);

    this.openItem = function(data) {
    	data.checked(true);
    	self.mode('view');
    	_.each(self.list(), function(item){
    		if(item.id() == data.id()) {
    			self.viewItem(item);
    		}
    	});
    };
    this.clickItem = function(data) {
    	_.each(self.list(), function(item){
    		item.checked(false);
    	});
    	self.openItem(data);
    };

    this.edit = function() {
    	self.editItem(self.viewItem());
    	self.mode('edit');
    };    

    this.getSelectedIds = function() {
    	var ids = [];
    	_.each(self.list(), function(item){
    		item.checked() && ids.push(item.id());
    	});
    	return ids;
    };

    this.loadData = function(data) {
    	_.each(data, function(item){
    		self.list.push(new self.ItemModel(item));
    	});
    };

};