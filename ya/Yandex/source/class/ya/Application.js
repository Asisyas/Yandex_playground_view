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

            var kernel = ya.core.Kernel.getInstance();
            kernel.init();
            // Init main root
            kernel.getUI().init(this.getRoot());
            // Example show application layer
            kernel.getApp("Yandex-Sandbox").display();
        }
    }
});
