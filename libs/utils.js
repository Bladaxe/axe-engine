define([
    'underscore'
], function(_){

    if(!String.prototype.ucFirst) String.prototype.ucFirst = function() {
        return this.charAt(0).toUpperCase() + this.substr(1);
    };

    /** @param {...*} message */
    var i = function(message){};

    window.log = { i: i, c: i, w: i, e: i};

    if(DEBUG){
        log.i = typeof console.log != 'undefined' ? _.bind(console.log, console): i;
        log.c = typeof console.error != 'undefined' ? _.bind(console.error, console, '%c%s', 'color: green'): log.i;
        log.w = typeof console.warn != 'undefined' ? _.bind(console.warn, console): log.i;
        log.e = typeof console.error != 'undefined' ? _.bind(console.error, console): log.i;
    }

    return '';
});
