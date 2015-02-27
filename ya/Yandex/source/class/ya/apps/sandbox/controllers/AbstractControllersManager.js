/**
 * Created by kost on 24.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.AbstractControllersManager", {

    extend: qx.core.Object,

    type: "abstract",

    events: {
        /**
         * Fired when html action
         */
        "html"          : "qx.event.type.Data"
    },

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
                this.debug('worker success response', e);
                this._sendWorkerResponse(e.getData());
            }, this);

            c.addListenerOnce("error", function(e) {
                this.debug('worker error response', e);
                this._sendWorkerResponse(e.getData());
            }, this);

            c.addListenerOnce("html", function(e) {
                this.debug('worker html event', e);
                this.fireDataEvent("html", e.getData());
            }, this);
        },

        _sendWorkerResponse: function(resp) {
            this.getWorker().call(resp);
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

            var act      = msg.action || 'index';
            var mdata    = msg.data || {};
            var cname    = msg.controller;
            if(!cname) {
                msg.action  = 'controller_error';
                cname       = 'base';

                return;
            }
            var controller = this._getControllerByRef(cname, 'base');
            this._registerControllerListeners(controller);
            controller.call(act, mdata);
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