define([
    'underscore'
], function(_){

    /** @class Mediator */
    var Mediator = function(){

        var _channels = {}
            ,_data = {}
            ;

        var _publishOnce = function(channel, subscription, data){
            subscription.callback.apply(subscription.context || this, data);
            return true;
        };

        var _publishAll = function(channel){
            var args = Array.prototype.slice.call(arguments, 1)
                ,subscription
                ,deleteElements = []
                ;
            _channels[channel] = _channels[channel] || [];

            for (var i = 0, l = _channels[channel].length; i < l; i++) {
                subscription = _channels[channel][i];
                subscription.callback.apply(subscription.context || this, args);
                if(subscription.once){
                    deleteElements.push(subscription);
                }
            }

            _channels[channel] = _.without(_channels[channel], deleteElements);
            return false;
        };
        
        /**
         * Mediator pattern method
         * @param {String} channels may be multiple separated by space
         * @param {Function|Object} subscription
         */
        this.subscribe = function(channels, subscription){
            var a = channels.split(' '), i = a.length
                ;

            while(i--) {
                var channel = a[i];
                if (!_channels[channel]) _channels[channel] = [];

                if(_.isFunction(subscription)) {
                    subscription = {callback: subscription, context: this, once: false};
                } else if(_.isArray(subscription)) {
                    subscription = {callback: subscription[0], context: subscription[1] || this, once: false}
                } else {
                    subscription['context'] = subscription['context'] || this;
                }

                if(_data[channel]){
                    _publishOnce.call(this, channel, subscription, _data[channel]);
                    if(!subscription['once']){
                        _channels[channel].push(subscription);
                    }
                } else {
                    _channels[channel].push(subscription);
                }
            }

            return false;
        };

        /**
         * Mediator pattern method
         * @param {String} channels may be multiple separated by space
         */
        this.unsubscribe = function(channels){

            var a = channels.split(' '), i = a.length
                ;

            while(i--) {
                if (!_channels[a[i]]) continue;
                delete _data[a[i]];
                delete _channels[a[i]];
            }
        };

        /**
         * Mediator pattern method
         */
        this.publish = function(channel){
            _data[channel] = Array.prototype.slice.call(arguments, 1);
            _publishAll.apply(this, arguments);
        };

    };

    return new Mediator();
});