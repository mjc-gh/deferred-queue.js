jQuery Deferred Queue:

Easily execute sets of asynchronous JavaScript code. The queue can be paused and resume on demand.

This especially useful when chaining together animations that may varying durations. 

Example:

    var animator = $.DeferredQueue();
    
    function move_to(elem, position){
    	// return a function that gets called when set is executed
    	return function(){
    		// function returns a promise
    		elem.animate(pos, Math.random() * 5000);
    	}
    }
    
    // each set gets called with $.when when it is dequeued
    animator.queue(
    	move_to(one, { top: 250, left: 250 }),
    	move_to(two, { top: 250, left: 50 }),
    ).queue(
    	move_to(one, { top: 50, left: 50 }),
    	move_to(two, { top: 50, left: 250 }),
    ).queue(
    	move_to(one, { top: 250, left: 250 }),
    	move_to(two, { top: 250, left: 50 }),
    ).queue(
    	move_to(one, { top: 50, left: 50 }),
    	move_to(two, { top: 50, left: 250 }),
    );