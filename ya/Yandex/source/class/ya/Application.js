/* ************************************************************************

 Copyright:

 License:

 Authors:

 ************************************************************************ */

/**
 * This is the main application class of your custom application "Yandex"
 *
 * @asset(ya/*)
 */
qx.Class.define("ya.Application", {
    extend : qx.application.Standalone,

    members : {
        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         *
         * @lint ignoreDeprecated(alert)
         */
        main : function() {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug")) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            ya.core.Kernel.getInstance().init();
            var sb = ya.core.Kernel.getInstance().getApp("Yandex-Sandbox");
            console.log(sb);

            /*var yac = new ya.apps.sandbox.controllers.yandex.YandexMaps();
            yac.geocodeAction("Минск", function(code, data) {
                console.log(code, data);
            });
            */

            /*var source = "onmessage = function(e) { postMessage(e.data); }";
            var worker  = ya.core.Services.getInstance().service("sandbox.worker").createWorker(source, true);

            worker.addListener("change_status", function(e) {
                console.log("STATUS", e.getData().code);
            }, this);

            worker.addListener("message", function(e) {
                console.log("MESSAGE: " , e.getData());
                worker.terminate();
            }, this);

            worker.addListener("start", function() {
                var yac = new ya.apps.sandbox.controllers.yandex.YandexMaps();
                yac.addListener("remote_request_success", function(e) {
                    worker.call(e.getData());
                });
                yac.geocodeAction({geocode : "Минск"});
            }, this);

            worker.addListener("error", function(e) {
                worker.terminate();
            }, this);

            worker.start();
            */
            /*var geocoder = new ya.apps.sandbox.services.geocode.YandexGeocoder();
            geocoder.geocode("Минск", function(code, data) {
                console.log(code, data);
            });
            */
        }
    }
});
