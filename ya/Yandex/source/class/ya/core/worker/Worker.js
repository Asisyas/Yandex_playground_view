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
        "error"         :   "qx.event.type.Data",
        "change_status" :   "qx.event.type.Data"
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
        __status: 0,

        /**
         * window.Worker
         */
        __worker: null,

        /**
         * Terminate application
         */
        terminate: function() {
            var runStatus       =   this.getStatusCode("run"),
                terminateStatus =   this.getStatusCode("terminate"),
                currentStatus   =   this.__status,
                invalidStatus   =   runStatus | terminateStatus;

            if(currentStatus && !invalidStatus & currentStatus) {;
                this.__worker.terminate();
            }
            this.__worker = undefined;

            currentStatus ^= currentStatus & runStatus ? runStatus : 0;
            currentStatus |= terminateStatus;
            this._setStatus(currentStatus);
        },

        /**
         * Start application
         */
        start: function() {
            return this._start();
        },

        /**
         * Restart application
         */
        reload: function() {
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
         * @todo: In any case, write the test for the "bad" start
         * @private
         */
        _start: function() {
            var impossibleStatus =
                this.getStatusCode("run") |
                this.getStatusCode("error") |
                this.getStatusCode("destroyed"),
                currentStatus   =   this.__status;

            if(currentStatus && currentStatus & impossibleStatus) {
                return false;
            }

            try {
                this.__worker = new Worker(this.getCode().getCode());
                this.__worker.onmessage = qx.lang.Function.bind(this._onMessage,    this);
                this.__worker.onerror   = qx.lang.Function.bind(this._onError,      this);
                this.fireDataEvent("start");
                this._setStatus(this.getStatusCode("run"));
                return true;
            } catch(e) {
                this._setStatus(this.getStatusCode("error"), null, e);
                return false;
            }
        },

        /**
         * Change application status
         * @param code  {Number}        - status code
         * @param data  {null|Object}   - Event data
         * @param error {null|Error}    - Error object
         * @private
         */
        _setStatus: function(code, data, error) {
            if(this.__status == code) {
                return;
            }

            this.__status = code;
            this.fireDataEvent("change_status", {
                code    :   code,
                data    :   data,
                error   :   error
            });
        },

        /**
         * Trigger
         * @param e
         * @private
         */
        _onChangeCode: function(e) {
            var curr        =   e.getData(),
                old         =   e.getOldData(),
                currStatus  =   this.__status,
                statusReady =   this.getStatusCode("ready"),
                statusError =   this.getStatusCode("error"),
                currentCode =   !curr || curr.getCode(),
                oldCode     =   !old  || old.getCode();

            if(!currentCode || currentCode == null || currentCode.length < 1) {
                currStatus ^= currStatus & statusReady ? statusReady : 0;
            } else if(oldCode == currentCode && currStatus & statusError != 0) {
                return;
            } else {
                currStatus |= statusReady;
                currStatus ^= currStatus & statusError ? statusError : 0;
            }

            this._setStatus(currStatus, null, null);
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
            this.addListener("change_code",     this._onChangeCode,    this);
        }
    },

    destruct: function() {
        this.base(arguments);
        this.terminate();
        this.__status = null;
        this.__worker = undefined;
    }

});