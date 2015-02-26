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

    /**
     *
     * @param worker {ya.apps.sandbox.services.worker.Worker}
     */
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
         * Get all controllers references
         * @returns {*}
         * @private
         */
        _getControllersRefs: function() {
            return this.__controllers;
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

        _runController: function(name, method, args) {
            var c = this._getControllersRefs();
            var w = this.getWorker();
            if(!c[name]) {

            }
        },

        /**
         * Event handler receiving a message from the Worker
         * @param e {qx.event.type.Data}
         * @private
         */
        _onWorkerMessage: function(e) {
            var msgObj      = e.getData();
            var msgData     = msgObj.data;
            var cname       = msgData.controller;
            var method      = msgData.method;
            this._runController(cname, method, msgObj.data);
        },

        /**
         * Event handler when inside Worker errors
         * @param e {qx.event.type.Data}
         * @private
         */
        _onWorkerError: function(e) {
        },

        /**
         * Register worker events handlers
         * @param w {ya.apps.sandbox.services.worker.Worker} current worker
         * @private
         */
        _registerWorkerListeners: function(w) {
            w.addListener("message",    this._onWorkerMessage,      this);
            w.addListener("error",      this._onWorkerError,        this);
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