/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.application.BaseApplication", {

    extend: qx.core.Object,

    type: "abstract",

    events: {

        /**
         * Fired when module registered
         */
        init        : "qx.event.type.Data",

        /**
         * Fires when the module must be active
         */
        show        : "qx.event.type.Data",

        /**
         * Fires when the module must be inactive
         */
        hide        : "qx.event.type.Data"
    },

    construct: function() {
        this.base(arguments);
    },

    members: {

        __layer : null,
        /**
         * init application
         * @param args {Map} - Map with config
         */
        init: function(args) {
            this.registerServices();
        },

        registerServices: function() {
        },

        /**
         * @returns {null}
         */
        getLayer: function() {
            throw new Error("Method must be rewrite");
        },

        getName: function() {
            throw new Error("Method must be rewrite");
        },

        /**
         * Fires "show" event
         */
        display: function() {
            this.fireDataEvent("show", this);
        },

        /**
         * Register app services
         * @param name  {String}    service name
         * @param clazz {class}     service class reference
         * @param args  {Map|null}  constructor service options
         * @private
         */
        _addService: function(name, clazz, args) {
            ya.core.Services.getInstance().addService(
                {
                    name    : name,
                    clazz   : clazz,
                    args    : args
                }
            );
        }
    }

});


