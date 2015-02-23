/**
 * Created by kost on 20.02.15.
 */

qx.Class.define("ya.core.Kernel", {

    extend: qx.core.Object,

    type: "singleton",

    events: {
        load            : "qx.event.type.Data",
        unload          : "qx.event.type.Data",
        module_init     : "qx.event.type.Data",
        module_destroy  : "qx.event.type.Data"
    },

    members: {

        __modules: [],

        init: function() {
            this._registerListeners();
            this._registerModules([
                new ya.apps.geocoder.Geocoder(),
                // init sandbox application
                new ya.apps.sandbox.Sandbox()
            ]);
        },

        /**
         * Array with applications
         * @param apps
         * @private
         */
        _registerModules: function(apps) {
            for(var i = 0; i < apps.length; i++) {
                this._registerModule(apps[i]);
            }
        },

        _registerModule: function(app) {
            this._registerModuleListeners(app);
            app.init();
            this.__modules.push(app);
            this.fireDataEvent("app_init", app);
        },

        _registerModuleListeners: function(app) {

        },

        _registerListeners: function() {
            this.addListener("module_init",    function() {}, this);
            this.addListener("module_destroy", function() {}, this);
        }
    }

});