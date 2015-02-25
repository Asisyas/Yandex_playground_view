/**
 * Created by kost on 20.02.15.
 *
 * The kernel modules for observing
 *
 */

qx.Class.define("ya.core.Kernel", {

    extend: qx.core.Object,

    type: "singleton",

    events: {

        /**
         * Fired when application Kernel loaded
         */
        load            : "qx.event.type.Data",

        /**
         * Fired when application destroyed
         */
        unload          : "qx.event.type.Data",

        /**
         * Fired when application module registered
         */
        app_init     : "qx.event.type.Data"
    },

    members: {

        /**
         *  {boolean}
         */
        __status: false,

        /**
         * Map with modules
         */
        __modules: {},

        /**
         *  {ya.core.UIKernel}
         */
        __ui: null,

        /**
         * {ya.core.application.BaseApplication} Current visible application
         */
        __activeModule: null,

        /**
         * Array with applications
         * @todo: dynamic
         * @private
         */
        _registerModules: function() {
            var apps = [
                new ya.apps.geocoder.Geocoder(),
                // init sandbox application
                new ya.apps.sandbox.Sandbox()
            ];

            for(var i = 0; i < apps.length; i++) {
                this._registerModule(apps[i]);
            }
        },

        /**
         * Init kernel modules
         * @todo: tests
         */
        init: function() {
            this.debug("Load Kernel");

            // Evil hack !!!
            //@todo: Create normal initialization
            if(this.__status) {
                this.warn("Trying to duplicate initialization");
                return;
            }

            this.__ui = ya.core.UIKernel.getInstance();
            this.__status = true;
            this._registerListeners();
            this._registerModules();
        },

        /**
         * Return UI kernel
         * @returns {ya.core.UIKernel}
         */
        getUI: function() {
            return this.__ui;
        },

        /**
         * Map with applications
         * @returns {*}
         */
        getApps: function() {
            return this.__modules;
        },

        /**
         * Get application by name
         * @param appName {String} Application name. See ya.core.application.BaseApplication
         * @returns {*}
         */
        getApp: function(appName) {
            return this.__modules[appName];
        },

        /**
         * Register application
         * @param app
         * @private
         */
        _registerModule: function(app) {

            var appName = app.getName();
            if(this.__modules[appName]) {
                throw new Error("Application " + appName + " already registered");
            }
            this._registerModuleListeners(app);
            app.init();
            this.__modules[appName] = app;
            this.fireDataEvent("app_init", app);
        },

        /**
         * Create app listeners
         * @param app
         * @private
         */
        _registerModuleListeners: function(app) {
            app.addListener("show",     this._onModuleActive,   this);
            app.addListener("hide",     function(){},           this);
        },

        /**
         *
         * @param e {qx.event.type.Data}
         * @private
         */
        _onModuleActive: function(e) {
            var m               = e.getData();
            var ui              = this.getUI();
            var activeLayer     = this.__activeModule ? this.__activeModule.getLayer() : null;
            var currentLayer    = m.getLayer() || null;

            !activeLayer  || ui.remove(activeLayer);
            !currentLayer || ui.display(currentLayer);
        },
        /**
         * Trigger
         * @param e {qx.event.type.Data}
         * @private
         */
        _onModuleRegistered: function(e) {
            this.debug("Register module " + e.getData().getName());
        },

        /**
         * @todo:
         * @private
         */
        _registerListeners: function() {
            this.addListener("app_init",    this._onModuleRegistered, this);
        }
    }

});