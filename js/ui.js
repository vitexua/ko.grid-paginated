var ui = {};

(function() {
	ui._toLowerCase = function(value) {
	    return value && value.toLowerCase ? value.toLowerCase() : value;
	};
}).apply(ui);