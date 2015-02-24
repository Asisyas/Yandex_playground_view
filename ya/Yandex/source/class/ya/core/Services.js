/**
 * Created by kost on 20.02.15.
 * Container for storing references application modules
 */

qx.Class.define("ya.core.Services", {

    extend: qx.core.Object,

    type: "singleton",

    events: {

        /**
         * Fired when the service module is registered
         */
        init_service        : "qx.event.type.Data",

        /**
         * when the service module is registered with errors
         */
        error_init_service  : "qx.event.type.Data"
    },

    construct: function() {
        this.base(arguments);
        this._registerListeners();
    },

    members: {

        __services: {},

        /**
         * Add applications services
         * @param schema
         */
        addService: function(schema) {
            var name    = schema.name;
            var clazz   = schema.clazz;
            var args    = schema.args;

            if(!name) {
                throw new Error("The service name must be defined.");
            }

            var ss = this.__services;
            if(ss[name]) {
                this.fireDataEvent("error_init_service", name);
                throw new Error("The service name is already registered.");
            }
            // Register service instance
            this._registerService(name, new clazz(args));
        },

        /**
         * Register service triggers and other
         * @param name      {String}
         * @param service   {Object}
         * @private
         */
        _registerService: function(name, service) {
            this.__services[name]        = service;
            this.fireDataEvent("init_service", name);
        },

        /**
         * Service
         * @param name
         * @returns {*}
         */
        service: function(name) {
            this.debug("Get service " + name);
            return this.__services[name];
        },

        /**
         * Trigger
         * @param e
         * @private
         */
        _onServiceInit: function(e) {
            var s = e.getData();
            this.debug("Registered service " + s);
        },

        /**
         * Trigger
         * @param e
         * @private
         */
        _onServiceInitError: function(e) {
            var s = e.getData();
            this.error("Registered service " + s + " filed !");
        },

        /**
         * Register triggers
         * @private
         */
        _registerListeners: function() {
            this.addListener("init_service",        this._onServiceInit,        this);
            this.addListener("error_init_service",  this._onServiceInitError,   this);
        }
    }
});