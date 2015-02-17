/**
 * Created by kost on 17.02.15.
 */


qx.Class.define("ya.core.worker.BaseWorkerCode", {

    extend: qx.core.Object,

    properties: {

        source: { init: null,   check: "String",    event: "change_code" }

    },

    members: {

        /**
         * Get code object
         */
        getCode: function() {
            throw new Error("Method must be overridden");
        }
    }
});