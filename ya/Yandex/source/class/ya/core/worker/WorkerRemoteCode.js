/**
 * Created by kost on 18.2.15.
 * Generator links to remote code
 */

qx.Class.define("ya.core.worker.WorkerRemoteCode", {

    extend: ya.core.worker.BaseWorkerCode,

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