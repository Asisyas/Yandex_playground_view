/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.worker.Worker", {

    extend: qx.core.Object,

    events: {
        "start"         :   "qx.event.type.Data",
        "terminate"     :   "qx.event.type.Data",
        "reload"        :   "qx.event.type.Data",
        "message"       :   "qx.event.type.Data"
    },

    construct: function() {
        this.base(arguments);

        if(!window.Worker) {
            throw new Error("Not supported");
        }

        this.__status = false;
        this._registerListeners();
    },

    properties: {
        code: { init: null, check: "ya.core.worker.BaseWorkerCode", event: "change_code" }
    },

    members: {

        __status: null,

        /**
         * window.Worker
         */
        __worker: null,

        terminate: function() {
            if(this.__status != true) {
                return;
            }
            this.__worker.terminate();
            this.__worker = undefined;
            this.__status = false;
            this.fireDataEvent("terminate");
        },

        reload: function() {
            if(this.__status != true) {
                return;
            }
            this.fireDataEvent("reload");
            this.terminate();
            this._start();
        },

        _start: function() {
            if(this.__status == true) {
                throw new Error("WTF");
            }

            var code = this.getCode();

            this.fireDataEvent("start");

        },

        _registerListeners: function() {
            this.addListener("change_code",     this.reload,    this);
        }
    },

    destruct: function() {
        this.__status = null;
        this.__worker = undefined;
    }

});