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

    members: {

        __layer : null,

        /**
         * init application
         * @param args {Map} - Map with config
         */
        init: function(args) { },

        /**
         * @returns {null}
         */
        getLayer: function() {
            throw new Error("Method must be rewrite");
        }
    }

});


