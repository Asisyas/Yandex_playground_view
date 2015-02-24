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
                this.fireDataEvent("init_service", name);
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
            this.fireDataEvent("init_service", service);
        },

        /**
         * Service
         * @param name
         * @returns {*}
         */
        service: function(name) {
            return this.__services[name];
        }
    }
});