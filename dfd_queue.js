(function($){
	var slice = Array.prototype.slice;
	
	function build_promises(args){
		var promises = [];
		
		for (var i = 0; i < args.length; i++){
			var fn = args[i];
			promises.push(fn.call());
		}
		
		return promises;
	}

	$.DeferredQueue = function(){
		var creating = false;
		var paused = false;
		
		var queue = [];
		var promise = null;

		function create(funcs){
			var promises = build_promises(funcs);
			return $.when.apply($, promises).then(dequeue);
		}

		function dequeue(){
			if (paused) return;
			
			if (!queue.length)
				promise = null;
			else
				return create(queue.shift());
		}

		return {
			queue:function(){
				var args = slice.call(arguments);
				
				if (promise && promise.isResolved())
					promise = null;
					
				if (promise || creating)
					queue.push(args);
				
				if (!promise && !creating){			
					creating = true;
					promise = create(args);
					creating = false;
				}
				
				return this;
			},
			
			pause:function(){
				paused = true;
			},
			
			resume:function(){
				paused = false;
				
				dequeue();
			},
			
			resumeWith:function(){
				var args = slice.call(arguments);
				queue.unshift(args);
				
				this.resume();
			},
			
			length:function(){
				return queue.length;
			}
		};
	};	
})(jQuery);