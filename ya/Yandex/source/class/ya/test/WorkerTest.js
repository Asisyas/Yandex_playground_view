/**
 * Created by kost on 18.2.15.
 */
qx.Class.define("ya.test.WorkerTest", {
    extend : qx.dev.unit.TestCase,

    members : {
        /**
         * Here are some simple tests
         */
        testMessage : function() {
            var worker  = new ya.core.worker.Worker();
            worker.addListener("message", function(e) {
                this.resume(function(){
                    this.assertEquals(1, e.getData().data, "Test response");
                }, this);
                worker.terminate();
            }, this);

            var code    = new ya.core.worker.WorkerSourceCode();
            var source = "postMessage(1)";
            code.setSource(source);
            worker.setCode(code);
            worker.start();

            this.wait(5000);
        }
    }
});