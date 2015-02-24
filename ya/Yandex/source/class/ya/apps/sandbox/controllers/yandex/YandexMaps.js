/**
 * Created by kost on 19.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.yandex.YandexMaps", {

    extend: ya.apps.sandbox.controllers.BaseController,

    construct: function(worker) {
        this.base(arguments);
    },

    members: {
        /**
         * @returns {string} controller name
         */
        getName: function() {
            return 'yandex-maps';
        },

        /**
         * Register routing
         * @private
         */
        _registerRoutes: function() {
            this.base(arguments);
            this.addRoute("geocode", this.geocodeAction);
        },

        /**
         * Yandex Maps geocoding
         * @param data      {Map} Worker data
         * @param callback  {Function}
         */
        geocodeAction: function(data, callback) {
            var geocoder = this.services.service("geocoder.yandex");
            geocoder.geocode(data, callback);
        }
    }

});