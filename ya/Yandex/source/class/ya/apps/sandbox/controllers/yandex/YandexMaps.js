/**
 * Created by kost on 19.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.yandex.YandexMaps", {

    extend: ya.apps.sandbox.controllers.AbstractController,

    statics: {
        /**
         * Controller string reference
         * @returns {string}
         */
        getName: function() {
            return 'yandex-maps';
        }
    },

    construct: function(worker) {
        this.base(arguments);
    },

    members: {

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
         */
        geocodeAction: function(data) {
            var geocoder    = this.services.service("geocoder.yandex");
            var geoname     = data.geocode;
            var statics     = ya.apps.sandbox.controllers.AbstractController;
            if(!geoname) {
                this.createWorkerAnswer(statics.ERROR_LOGIC,
                    {
                        message: "Parameter 'geocode' must be initialized"
                    }
                );
            }
            geocoder.geocode(geoname, qx.lang.Function.bind(function(status, geodata) {
                this.createWorkerAnswer(statics.ERROR_NONE,
                    {
                        code    : status,
                        response: !status ? geodata.response : null
                    }
                );
            } , this));
        }
    }

});