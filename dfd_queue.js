(function($){
	var slice = Array.prototype.slice;
	
	function build_promises(args){
		var promises = [];
		
		for (var i = 0; i < args.length; i++){
			var fn = args[i];
			promises.push(fn.call ? fn.call() : fn);
		}
		
		return promises;
	}

	$.DeferredQueue = function(){
		var creating = false;
		var paused = false;
		
		var queue = [];
		var promise = null;

		function create(funcs){
			console.debug('create', funcs[0].id);
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
				
				if (promise && promise.state() == 'resolved' && !queue.length)
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
			
			replace:function(index){
				var args = slice.call(arguments, 1);
				queue[index] = args;
				
				return this;
			},
			
			state:function(){
				if (promise)
					return promise.state();
				
				return 'empty';
			},
			
			length:function(){
				return queue.length;
			}
		};
	};	
})(jQuery);