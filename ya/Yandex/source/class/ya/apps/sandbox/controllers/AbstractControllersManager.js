/**
 * Created by kost on 24.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.AbstractControllersManager", {

    extend: qx.core.Object,

    type: "abstract",

    properties: {
        /**
         * Worker
         */
        worker: { init: null,   check: "ya.apps.sandbox.services.worker.Worker",    event: "change_worker" }
    },

    construct: function(worker) {
        this.base(arguments);
        this._registerListeners();
        this.init();
        !worker || this.setWorker(worker);
    },

    members: {

        __controllers: {},

        /**
         * Init controllers
         */
        init: function() {
            this.registerController(ya.apps.sandbox.controllers.BaseController);
        },

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
         * @param controller {ya.apps.sandbox.controllers.AbstractController}
         */
        registerController: function(controller) {
            var cname = controller.getName();
            this.__controllers[cname] = controller;
        },

        /**
         * Get controller contructor by string reference
         * @param cname {String} - Controller name
         * @param def   {String} - Default controller name
         * @private
         */
        _getControllerByRef: function(cname, def) {
            return this.__controllers[cname] ?
                new this.__controllers[cname] :
                def ?
                    new this.__controllers[def]:
                    null;
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
         * Register controller listeners
         * @param c {ya.apps.sandbox.controllers.AbstractController}
         * @private
         */
        _registerControllerListeners: function(c) {
            c.addListenerOnce("success", function(e) {
                console.log('CONTROLLER_SUCCESS', e);
            }, this);
            c.addListenerOnce("error", function(e) {
                console.log('CONTROLLER_ERROR', e);
            }, this);
        },

        /**
         * Error event handler
         * @param e
         * @private
         */
        _onWorkerError: function(e) {

        },

        /**
         * Controller message
         * @param e
         * @private
         */
        _onWorkerMessage: function(e) {
            var msg      = e.getData().data;
            var mdata    = msg.data || {};
            var cname    = msg.controller;
            var hasError = false;
            if(!cname) {
                hasError    = true;
                msg.action  = 'controller_error';
                cname       = 'base';

                return;
            }
            var controller = this._getControllerByRef(cname, 'base');
            this._registerControllerListeners(controller);
            var action = msg.action || "index";
            controller.call(action, mdata);
        },

        /**
         * Register worker event handlers
         * @param w
         * @private
         */
        _registerWorkerListeners: function(w) {
            w.addListener("message",    this._onWorkerMessage,   this);
            w.addListener("error",      this._onWorkerError,     this);
        },

        /**
         * Register triggers
         * @private
         */
        _registerListeners: function() {
            this.addListener("change_worker",   this._onChangeWorker,   this);
        }
    },

    destruct: function() {
        this.disposeMap("__controllers");
    }
});