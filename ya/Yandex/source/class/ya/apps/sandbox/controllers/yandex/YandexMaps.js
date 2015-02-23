/**
 * Created by kost on 19.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.yandex.YandexMaps", {

    extend: ya.apps.sandbox.controllers.BaseController,

    events: {
        remote_request_success  : "qx.event.type.Data",
        remote_request_error    : "qx.event.type.Data"
    },

    statics: {

        GEOCODE_URL : "http://geocode-maps.yandex.ru/1.x/"
    },

    construct: function(worker) {
        this.base(arguments);
    },

    members: {

        _registerRoutes: function() {
            this.base(arguments);
            this.addRoute("geocode", this.geocodeAction);
        },

        /**
         * Yandex Maps geocoding
         * @param data
         */
        geocodeAction: function(data, callback) {
            var geocoder = this.services.service("geocoder.yandex");
            geocoder.geocode(data, callback);
        },
        /**
         * @returns {string} - controller name
         */
        getName: function() {
            return 'yandex-maps';
        }
    }

});