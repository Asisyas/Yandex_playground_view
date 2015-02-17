/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.core.worker.Worker", {

    extend: qx.core.Object,

    events: {
        "start"         :   "qx.event.type.Data",
        "terminate"     :   "qx.event.type.Data",
        "reload"        :   "qx.event.type.Data",
        "message"       :   "qx.event.type.Data",
        "call"          :   "qx.event.type.Data",
        "error"         :   "qx.event.type.Data"
    },

    statics: {

        STATUS_TERMINATE    :   0x1,

        STATUS_ERROR        :   0x2,

        STATUS_READY        :   0x4,

        STATUS_DESTROYED    :   0x8,

        STATUS_RUN          :   0x10,

        /**
         * @todo: Doubtful check
         * @returns {boolean}
         */
        canRun: function() {
            return !!window.Worker;
        }
    },

    construct: function() {
        this.base(arguments);

        if(!ya.core.worker.Worker.canRun()) {
            throw new Error("Not supported");
        }

        this.__status = 0;
        this._registerListeners();
    },

    properties: {
        code: { init: null, check: "ya.core.worker.BaseWorkerCode", event: "change_code" }
    },

    members: {

        /**
         * {Number}
         */
        __status: null,

        /**
         * window.Worker
         */
        __worker: null,

        /**
         * Terminate application
         */
        terminate: function() {
            if(this.__status != true) {
                return;
            }
            var self = this.self(arguments);
            this.__worker.terminate();
            this.__worker = undefined;
            this.__status = self.STATUS_TERMINATE;
            this.fireDataEvent("terminate");
        },

        /**
         * Start application
         */
        start: function() {
            var self = this.self(arguments);
            if(!(self & self.STATUS_READY)) {
                throw new Error("The code is not initialized or it contains errors");
            }
            this._start();
        },

        /**
         * Restart application
         */
        reload: function() {
            var self = this.self(arguments);

            if(this.__status != self.TERMINATE) {
                return;
            }
            this.fireDataEvent("reload");
            this.terminate();
            this._start();
        },

        /**
         * Sending a message
         * @param message
         * @returns {boolean}
         */
        call: function(message) {
            var status = this.__status;
            var code = this.getStatusCode("run");
            if(status & code != code) {
                return false;
            }

            this.fireDataEvent("call", message);
            this.__worker.postMessage(message);
            return true;
        },

        /**
         * Current status
         * @returns {null}
         */
        getStatus: function() {
            return this.__status;
        },

        /**
         * @todo: Bad !!!! Evil hack !!!
         * @param ref
         * @returns {Number}
         */
        getStatusCode: function(ref) {
            var self = this.self(arguments);
            var stts = {};
            stts['terminate']   =   self.STATUS_TERMINATE;
            stts['error']       =   self.STATUS_ERROR;
            stts['ready']       =   self.STATUS_READY;
            stts['destroyed']   =   self.STATUS_DESTROYED;
            stts['run']         =   self.STATUS_RUN;
            return stts[ref];
        },

        /**
         * Load code and run Worker
         * @private
         */
        _start: function() {
            var impossibleStatus = this.getStatusCode("run");
            if(this.__status & impossibleStatus == impossibleStatus) {
                throw new Error("WTF");
            }

            this.__worker = new Worker(this.getCode().getCode());
            this.__worker.onmessage = qx.lang.Function.bind(this._onMessage,    this);
            this.__worker.onerror   = qx.lang.Function.bind(this._onError,      this);
            this.fireDataEvent("start");

        },

        /**
         * Triggered by the event you receive a message
         * @param data
         * @private
         */
        _onMessage: function(data) {
            this.fireDataEvent("message",   data);
        },

        /**
         * Triggered by the event you receive an error
         * @param data
         * @private
         */
        _onError: function(data) {
            this.fireDataEvent("error", data);
        },

        /**
         * Register event handlers
         * @private
         */
        _registerListeners: function() {
            this.addListener("change_code",     this.reload,    this);
        }
    },

    destruct: function() {
        this.__status = null;
        this.__worker = undefined;
    }

});