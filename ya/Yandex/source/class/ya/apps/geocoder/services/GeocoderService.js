/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.geocoder.services.GeocoderService", {

    extend: ya.core.application.BaseService,

    createYandexGeocoder: function() {
        return new ya.apps.geocoder.services.YandexGeocoder();
    }
});