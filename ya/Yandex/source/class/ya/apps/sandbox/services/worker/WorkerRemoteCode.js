/**
 * Created by kost on 18.2.15.
 * Generator links to remote code
 */

qx.Class.define("ya.apps.sandbox.services.worker.WorkerRemoteCode", {

    extend: ya.apps.sandbox.services.worker.BaseWorkerCode,

    members: {
        /**
         * link to a remote javascript code
         * @returns {String}
         * @override
         */
        getCode: function() {
            return this.getSource();
        }
    }
});