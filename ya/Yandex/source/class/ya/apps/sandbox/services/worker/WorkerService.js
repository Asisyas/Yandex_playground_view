/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.sandbox.services.worker.WorkerService", {
    extend: ya.core.application.BaseService,

    /**
     * @param args {Map}
     */
    construct: function(args) {
        this.base(arguments);
    },

    members: {

        /**
         * Create Web Worker
         * @param data   {String}   - source
         * @param isCode {Boolean}  - local/remote code. If false, the remote load script
         * @returns {*}
         */
        createWorker: function(data, isCode) {
            if(!ya.apps.sandbox.services.worker.Worker.canRun()) {
                return false;
            }
            var w = new ya.apps.sandbox.services.worker.Worker(),
                code;
            if(isCode) {
                code = new ya.apps.sandbox.services.worker.WorkerSourceCode();
            } else {
                code = new ya.apps.sandbox.services.worker.WorkerRemoteCode();
            }
            code.setSource(data);
            w.setCode(code);
            return w;
        }
    }
});