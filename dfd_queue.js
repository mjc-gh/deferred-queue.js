(function($){
	function build_promises(args){
		var promises = [];
		
		for (var i = 0; i < args.length; i++){
			var fn = args[i];
			promises.push(fn.call());
		}
		
		return promises;
	}

	$.DeferredQueue = function(){
		var queue = [];
		var promise = null;

		function create(funcs){
			var promises = build_promises(funcs);
			return $.when.apply($, promises).then(dequeue);;
		}

		function dequeue(){
			if (!queue.length)
				promise = null;
			else
				return create(queue.shift());
		}

		return {
			queue:function(){
				var args = Array.prototype.slice.call(arguments);
				
				if (promise){
					queue.push(args);
				} else {
					promise = create(args);
				}

				return this;
			}
		};
	};	
})(jQuery);