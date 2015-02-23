/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.SandboxRouter", {

    extend: qx.core.Object,

    events: {
        worker_message  : "qx.event.type.Data",
        worker_error    : "qx.event.type.Data",
        error_logic     : "qx.event.type.Data"
    },

    construct: function(worker) {
        this.base(arguments);
        this._registerListeners();
        this._registerControllers();
        this.setWorker(worker);
    },

    properties: {
        worker: { init: null, check: "ya.apps.sandbox.service.Worker", event: "change_worker" }
    },

    members: {
        __controllers: {},

        /**
         * Register application controllers
         * @private
         */
        _registerControllers: function() {
            this._registerController(new ya.apps.sandbox.controllers.yandex.YandexMaps());
        },


        _registerController: function(controller) {
            var name    = controller.getName();
            this.__controllers[name] = controller;
        },

        _onChangeWorker: function(e) {
            var old     = e.getOldData();
            var curr    = e.getData();

            if(old) {
                old.dispose();
            }

            curr.addListener("mesage", function() {
                this.fireDataEvent("worker_message", e.getData().data);
            }, this);
            curr.addListener("error", function(e) {
                this.fireDataEvent("worker_error", e);
            }, this);
        },

        _onMessage: function(e) {
            var d = e.data;
            if(!d || !d.controller) {
                this.fireDataEvent("error_logic", e);
            }
            var cname = d.controller;
            var controller = this.__controllers[cname];
            if(!controller) {}
        },

        _onError: function(msg) {
        },

        _onErrorLogic: function() {
            this.warn("Api logic error: ", msg);
        },

        _registerListeners: function() {
            this.addListener("change_worker",   this._onChangeWorker,   this);
            this.addListener("worker_message",  this._onMessage,        this);
            this.addListener("worker_error",    this._onError,          this);
            this.addListener("error_logic",     this._onErrorLogic,     this);
        }
    }

});