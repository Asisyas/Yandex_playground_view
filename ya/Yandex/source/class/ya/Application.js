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

            /*
            var worker  = new ya.core.worker.Worker();

            worker.addListener("change_status", function(e) {
                console.log("STATUS", e.getData().code);
            }, this);

            worker.addListener("message", function(e) {
                console.log("MESSAGE: " , e.getData());
                worker.terminate();
            }, this);

            worker.addListener("start", function() {
                worker.call(new qx.core.Object());
            }, this);

            worker.addListener("error", function() {
                worker.terminate();
            }, this);

            var code    = new ya.core.worker.WorkerSourceCode();
            var source = "onmessage = function(e) { postMessage(e); }";
            code.setSource(source);

            worker.setCode(code);
            worker.start();*/


            var sandbox = new ya.apps.sandbox.Sandbox();
            sandbox.start(qx.lang.Function.bind(function(){
                var doc = this.getRoot();
                doc.add(sandbox.getLayer(),  { edge : 0 });
            }, this));
        }
    }
});
