/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.application.BaseApplication", {

    extend: qx.core.Object,

    type: "abstract",

    events: {

        BEFORE_INIT : "qx.event.type.Data",

        AFTER_INIT  : "qx.event.type.Data"
    },

    members: {

        __status: -1,

        __layer : null,

        /**
         * Run application
         */
        start: function(callback) {},

        /**
         * Stop application
         */
        stop: function(callback) {},

        /**
         * Get application status
         */
        status: function() {},

        /**
         * @returns {null}
         */
        getLayer: function() {
            throw new Error("Method must be rewrite");
        }
    }

});