/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.worker.WorkerSourceCode", {

    extend: ya.core.worker.BaseWorkerCode,

    members: {
        /**
         * Return
         * @override
         */
        getCode: function() {
            var blob = new Blob(this.getSource() || "");
            var urlGenerator =  window.URL || window.webkitURL;
            return urlGenerator.createObjectURL(blob);
        }

    }

});