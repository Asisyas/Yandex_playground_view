/**
 * Created by kost on 17.02.15.
 * @todo: 1 - Double start/stop - Exceptions
 */

qx.Class.define("ya.apps.sandbox.services.worker.Worker", {

    extend: qx.core.Object,

    events: {

        /**
         * Fired when Worker start
         */
        "start"         :   "qx.event.type.Data",

        /**
         * Fired when Worker terminate
         */
        "terminate"     :   "qx.event.type.Data",

        /**
         * Fired when Worker reload
         */
        "reload"        :   "qx.event.type.Data",

        /**
         * Fired when Worker received message
         */
        "message"       :   "qx.event.type.Data",

        /**
         * Fired When a message is sent to Worker
         */
        "call"          :   "qx.event.type.Data",

        /**
         * Fired when worker have some errors
         */
        "error"         :   "qx.event.type.Data",

        /**
         * Fired when status changed
         */
        "change_status" :   "qx.event.type.Data"
    },

    statics: {

        /**
         * Bitmask presence status with an terminate.
         * Example: 0x1 | 0x3 - terminate with error
         */
        STATUS_TERMINATE    :   0x1,

        /**
         * Bitmask presence status with an error
         */
        STATUS_ERROR        :   0x2,

        /**
         * Bitmask presence status with an ready
         */
        STATUS_READY        :   0x4,

        /**
         * When destroyed
         */
        STATUS_DESTROYED    :   0x8,

        /**
         * itmask presence status with an run
         */
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
        this.__status = 0;
        this.__worker = null;
        this._registerListeners();
    },

    properties: {
        code: { init: null, check: "ya.apps.sandbox.services.worker.BaseWorkerCode", event: "change_code" }
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

            var statics = this.self(arguments);

            var runStatus       =   statics.STATUS_RUN;
            var terminateStatus =   statics.STATUS_TERMINATE;
            var destroyedStatus =   statics.STATUS_DESTROYED;
            var currentStatus   =   this.__status;
            var invalidStatus   =   runStatus | terminateStatus | destroyedStatus;
            var worker          =   this.__worker;
            if(currentStatus && invalidStatus & currentStatus) {
                worker.terminate();
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
            this.debug("Reload");
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
            if(status & code !== code) {
                return false;
            }

            this.fireDataEvent("call", message);
            this.debug("call", message);
            this.__worker.postMessage(message);
            return true;
        },

        /**
         * Current status
         * @returns {Number}
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
                this.debug("Start");
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
        this._disposeObjects("__worker");
    }

});