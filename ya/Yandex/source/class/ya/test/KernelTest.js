/**
 * Created by kost on 24.02.15.
 */

qx.Class.define("ya.test.KernelTest", {
    extend : qx.dev.unit.TestCase,

    members : {

        /**
         * Test Kernel initialize
         */
        testKernelInit : function() {

            var kernel = ya.core.Kernel.getInstance(),
                status = false;
            try {
                kernel.init();
                status = true;
            } catch (e) {
                this.error(e.getMessage());
            }

            this.assertEquals(true, status);
        }
    }
});

//ya.core.Kernel.getInstance().init();