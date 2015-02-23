/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.services.AbstractGeocoder", {

    extend: qx.core.Object,

    type: "abstract",

    members: {

        /**
         * Geocode
         * @param data
         * @param callback
         */
        geocode: function(data, callback) {
            throw new Error("Method must be overridden");
        }
    }

});