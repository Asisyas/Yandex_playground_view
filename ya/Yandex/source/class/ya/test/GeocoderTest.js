/**
 * Created by kost on 23.02.15.
 */
qx.Class.define("ya.test.GeocoderTest", {
    extend : qx.dev.unit.TestCase,

    members : {
        /**
         * Test geocodding
         */
        testYandexGeocoder : function() {
            var ygeo  = new ya.apps.geocoder.services.YandexGeocoder();
            this.debug("Create Yandex geocoder", ygeo);
            ygeo.geocode("Минск", qx.lang.Function.bind(function(code, data) {
                this.resume(function() {
                    this.debug("Response", code, data);
                    this.assertEquals(0, code, "Test response");
                }, this)
            },this));
            this.debug("Waiting response");
            this.wait(5000);
        }
    }
});