/**
 * Created by kost on 18.2.15.
 */
qx.Class.define("ya.test.WorkerTest", {
    extend : qx.dev.unit.TestCase,

    members : {
        /**
         * Here are some simple tests
         */
        testWorker : function() {
            var worker  = new ya.apps.sandbox.services.worker.Worker();
            this.debug("Create WebWorker instance", worker);
            worker.addListener("message", function(e) {
                this.resume(function(){
                    var msg = e.getData().data;
                    this.debug("Received message ", msg);
                    this.assertEquals(1, e.getData().data, "Test response");
                }, this);
                worker.terminate();
            }, this);

            var code    = new ya.apps.sandbox.services.worker.WorkerSourceCode();
            var source = "postMessage(1)";
            code.setSource(source);
            worker.setCode(code);
            worker.start();
            this.debug("Waiting... ");
            this.wait(5000);
        }
    }
});