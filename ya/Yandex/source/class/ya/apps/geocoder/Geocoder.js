/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.Geocoder", {

    extend: ya.core.application.BaseApplication,

    construct: function() {
        this.base(arguments);
    },

    members: {

        registerServices: function() {
            this._addService("geocoder.yandex", ya.apps.geocoder.services.YandexGeocoder, null);
        },


        getLayer: function() {
            return null;
        }

    }

});