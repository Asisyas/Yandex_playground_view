/**
 * Created by kost on 17.02.15.
 * Abstract class to generate code for the class "ya.core.worker.Worker"
 */
qx.Class.define("ya.core.worker.BaseWorkerCode", {

    extend: qx.core.Object,

    type: "abstract",

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