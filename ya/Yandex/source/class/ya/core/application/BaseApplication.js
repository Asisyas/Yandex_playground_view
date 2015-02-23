/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.application.BaseApplication", {

    extend: qx.core.Object,

    type: "abstract",

    events: {

        init        : "qx.event.type.Data",

        destroy     : "qx.event.type.Data"
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


