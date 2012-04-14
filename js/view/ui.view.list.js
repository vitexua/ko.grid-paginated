(function(){
    ui.view = ui.view || {};
    ui.view.list = function(options) {
        var self = this;

        this.localMode = options.localMode;
        this.ajaxMethod = options.ajaxMethod;
        this.storeFields = options.storeFields || [];
        this.listSortableField = options.listSortableField;
        this.listSearchableFields = options.listSearchableFields;

        this.events = {};
        _.extend(this.events, Backbone.Events);

        this.id = options.id || 'defaultid';

        this._higlighRemoveAll = function() {
            self.id && $('#'+self.id+' tr').removeClass('row-selected');
        };
        this._higlighRow = function(id) {
            id && self.id && $('#'+self.id+' tr.itemid_' + id).addClass('row-selected');
        };
        this._unhighlighRow = function(id) {
            id && self.id && $('#'+self.id+' tr.itemid_' + id).removeClass('row-selected');
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

            var _data = {};
            _.each(data, function(value, index){
                _data[self.storeFields[index]] = value;
            });
            this.id = ko.observable(_data.id);
            this.name = ko.observable(_data.name);
        };

        this.collection = ko.observableArray([]);
        this.editItem = ko.observable(new self.ItemModel());
        this.viewItem = ko.observable(new self.ItemModel());
        this.viewItem.subscribe(function(){     
            self._higlighRow(self.viewItem().id());
        });


        this.localSearch = ko.observable();

        this.pageIndex = ko.observable(1).extend({ throttle: 2 });
        this.pageIndex.subscribe(function(){
            self._clearAllChecked();
            self.checkedAll(false);
            !self.localMode && self.load();
        });
        this.perPage = ko.observable(options.perPage || 10);

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

        if(self.localMode) {
            self.pages = ko.dependentObservable(function(){
                return Math.ceil( self.filteredList().length / self.perPage() ) || 1;
            }).extend({ throttle: 1 });
        } else {
            self.pages = ko.observable(0);
        }

        self.filteredListPagged = ko.dependentObservable(function() {
            if(self.localMode) {
                return self.filteredList().slice(self.pageIndex() * self.perPage() - self.perPage(), self.pageIndex() * self.perPage());
            } else {
                return self.filteredList();                
            }
        }).extend({ throttle: 3 });

        this.mode = ko.observable('list'); // ['list','view','create']
        this.mode.subscribe(function(){
            if(self.mode() == 'create') {
                self.editItem(new self.ItemModel());
            }
        });
        this.viewMode = ko.observable('empty'); // ['show','load','empty']

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
        this.checkedItemsNumber.subscribe(function(){
            if(self.checkedItemsNumber() == 0) {
                self.viewMode('empty');
            } else if(self.checkedItemsNumber() == 1) {
                self.viewMode('show');
            } else {
                self.viewMode('empty');
            }
        });

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
            this.events.trigger('rowclick', data.id());
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

        this.loadPagedData = function(data) {
            self.list.removeAll();
            var numFound = parseInt(data.num_found, 10);
            var totalPages = Math.ceil( numFound / self.perPage() ) || 1;
            self.pages(totalPages);
            self.loadData(data.list);
        };

        this.loadData = function(data) {
            _.each(data, function(item){
                self.list.push(new self.ItemModel(item));
            });
        };

        this.load = function() {
            ui.ajax.list.load(self, self.loadPagedData);
        };

    };
}).apply(ui.view);