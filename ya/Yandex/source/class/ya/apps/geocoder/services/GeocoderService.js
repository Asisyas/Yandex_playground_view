/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.services.GeocoderService", {

    extend: ya.core.application.BaseService,

    construct: function() {
        this.base(arguments);
        this._init();
    },

    members: {

        __geocoders: {},

        _init: function() {
            this.__geocoders["yandex"] = ya.apps.geocoder.services.yandex.YandexGeocoder;
        },

        /**
         * Create geocoder instance
         *
         * @param name
         * @returns {ya.apps.geocoder.services.AbstractGeocoder | null}
         */
        createGeocoder: function(name) {
            var g = this.__geocoders[name];
            if(!g) {
                return null;
            }
            return new g();
        }
    }
});