/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.services.worker.WorkerSourceCode", {

    extend: ya.apps.sandbox.services.worker.BaseWorkerCode,

    members: {
        /**
         * Code in the blob
         * @override
         */
        getCode: function() {

            var blob = new Blob([this.getSource()] || "", {type: "text/javascript"});
            var urlGenerator =  window.URL || window.webkitURL;
            return urlGenerator.createObjectURL(blob);
        }

    }

});