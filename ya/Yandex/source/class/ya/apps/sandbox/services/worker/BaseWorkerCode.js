/**
 * Created by kost on 17.02.15.
 * Abstract class to generate code for the class "ya.apps.sandbox.services.worker.Worker"
 */
qx.Class.define("ya.apps.sandbox.services.worker.BaseWorkerCode", {

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