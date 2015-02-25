/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.services.yandex.YandexGeocoder", {

    extend: ya.apps.geocoder.services.AbstractGeocoder,

    statics: {

        /**
         * Geocoder URL
         */
        GEOCODE_URL             : "http://geocode-maps.yandex.ru/1.x/",

        /**
         * Fired when request completes without error and data has been received.
         */
        ERROR_REQUEST_SUCCESS   : 0,

        /**
         * Fired when request completes with error.
         */
        ERROR_REQUEST_FAIL      : 1,

        /**
         * Fired when request reaches timeout limit.
         */
        ERROR_REQUEST_TIMEOUT   : 2,

        /**
         * Fired when request is aborted.
         */
        ERROR_REQUEST_ABORT     : 3

    },

    members: {

        /**
         *
         * @param name       {String} Address location
         * @param callback   {Function}
         */
        geocode: function(name, callback) {
            var data = {
                geocode : name,
                format  : 'json'
            };
            this._call(data, callback);
        },

        /**
         * Create geocode request (JSONP)
         * @param data            {Map}
         * @param callback        {Function} callback
         * @private
         */
        _call: function(data, callback) {
            var clb = callback || new Function;
            var req = new qx.io.request.Jsonp();
            var statics = this.self(arguments);

            req.setUrl(this.self(arguments).GEOCODE_URL);
            req.addListenerOnce("success",      this._createSuccessCallback(clb),                              this);
            req.addListenerOnce("fail",         this._createFailCallback(clb, statics.ERROR_REQUEST_FAIL),     this);
            req.addListenerOnce("abort",        this._createFailCallback(clb, statics.ERROR_REQUEST_ABORT),    this);
            req.addListenerOnce("timeout",      this._createFailCallback(clb, statics.ERROR_REQUEST_TIMEOUT),  this);

            req.setRequestData(data);
            req.send();
        },

        /**
         * Trigger when response ok
         * @param callback  {Function}
         * @returns         {Function}
         * @private
         */
        _createSuccessCallback: function(callback) {
            var st = this.self(arguments).ERROR_REQUEST_SUCCESS;
            return function(e) {
                var req     = e.getTarget();
                var json    = req.getResponse();
                callback.call(null, st, json);
            };
        },

        /**
         * When response fail
         * @param callback  {Function}
         * @param status    {Integer} Error status
         * @returns         {Function}
         * @private
         */
        _createFailCallback: function(callback, status) {
            return function(e) {
                var req     = e.getTarget();
                callback.call(null, status, e);
            };
        }
    }

});