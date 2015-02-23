/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.services.YandexGeocoder", {

    extend: ya.apps.geocoder.services.AbstractGeocoder,

    statics: {

        GEOCODE_URL             : "http://geocode-maps.yandex.ru/1.x/",

        ERROR_REQUEST_SUCCESS   : 0,

        ERROR_REQUEST_FAIL      : 1,

        ERROR_REQUEST_TIMEOUT   : 2,

        ERROR_REQUEST_ABORT     : 3

    },

    members: {

        geocode: function(name, callback) {
            var data = {
                geocode : name,
                format  : 'json'
            };
            this._call(data, callback);
        },

        _call: function(data, callback) {
            var clb = callback || new Function,
                req = new qx.io.request.Jsonp(),
                statics = this.self(arguments);

            req.setUrl(this.self(arguments).GEOCODE_URL);
            req.addListenerOnce("success",      this._createSuccessCallback(clb),                              this);
            req.addListenerOnce("fail",         this._createFailCallback(clb, statics.ERROR_REQUEST_FAIL),     this);
            req.addListenerOnce("abort",        this._createFailCallback(clb, statics.ERROR_REQUEST_ABORT),    this)
            req.addListenerOnce("timeout",      this._createFailCallback(clb, statics.ERROR_REQUEST_TIMEOUT),  this);

            req.setRequestData(data);
            req.send();
        },

        _createSuccessCallback: function(callback) {
            var st = this.self(arguments).ERROR_REQUEST_SUCCESS;
            return function(e) {
                var req     = e.getTarget();
                var json    = req.getResponse();
                callback.call(null, st, json);
            };
        },

        _createFailCallback: function(callback, status) {
            return function(e) {
                var req     = e.getTarget();
                callback.call(null, status, e);
            };
        }
    }

});