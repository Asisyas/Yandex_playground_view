/**
 * Created by kost on 24.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.ControllersObserver", {

    extend: qx.core.Object,

    properties: {
        /**
         * Worker
         */
        worker: { init: null,   check: "ya.apps.sandbox.services.worker.Worker",    event: "change_worker" }
    },

    construct: function(worker) {
        this.base(arguments);
        this._registerListeners();
        !worker || this.setWorker(worker);
    },

    members: {

        __controllers: {},

        /**
         * Register controllers
         * @param ccol {Array}
         */
        registerControllers: function(ccol) {
            var cl = ccol.length;
            for(var i = 0; i < cl; i++) {
                var tmp = ccol[i];
                this.registerController(tmp);
            }
        },

        /**
         * Register controller in observer
         * @param controller {ya.apps.sandbox.controllers.BaseController}
         */
        registerController: function(controller) {
            var cname = controller.getName();
            this.__controllers[cname] = controller;
        },

        /**
         * Fired when worker changed
         * @param e {qx.event.type.Data}
         * @private
         */
        _onChangeWorker: function(e) {
            var d   = e.getData();
            var o   = e.getOldData();

            if(o) {
                this.debug("Remove old worker");
                o.terminate();
                o.dispose();
            }
            this._registerWorkerListeners(d);
            this.debug("Change worker");
        },

        /**
         * Controller listeners
         * @param c {ya.apps.sandbox.controllers.BaseController}
         * @private
         */
        _registerControllerListeners: function(c) {

        },

        _registerWorkerListeners: function(w) {
            w.addListener("message",    function(e) { console.log(e.getData()); this.getWorker().terminate()  },    this);
            w.addListener("error",      function(e) { console.log(e.getData()); this.getWorker().terminate() },     this);
            //w.addListener("terminate");
        },

        /**
         * Register triggers
         * @private
         */
        _registerListeners: function() {
            this.addListener("change_worker",   this._onChangeWorker,   this);
        }
    }
});