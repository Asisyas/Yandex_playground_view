/**
 * Created by kost on 20.02.15.
 */

qx.Class.define("ya.core.Kernel", {

    extend: qx.core.Object,

    type: "singleton",

    events: {
        load        : "qx.event.type.Data",
        unload      : "qx.event.type.Data",
        app_init    : "qx.event.type.Data",
        app_destroy : "qx.event.type.Data"
    },

    members: {

        __apps: [],

        init: function() {
            this._registerListeners();
            this._registerApps([
            ]);
        },

        /**
         * Array with applications
         * @param apps
         * @private
         */
        _registerApps: function(apps) {
            for(var i = 0; i < apps.length; i++) {
                this._registerApp(apps[i]);
            }
        },

        _registerApp: function(app) {
            this._registerAppListeners(app);
            app.init();
            this.__apps.push(app);
            this.fireDataEvent("app_init", app);
        },

        _registerAppListeners: function(app) {

        },

        _registerListeners: function() {
            this.addListener("app_init",    function() {}, this);
            this.addListener("app_destroy", function() {}, this);
        }
    }

});