/**
 * Created by kost on 18.2.15.
 * The event handler of the Worker
 * @todo: Hellish and very angry crutch. No correct processing of events from Worker
 * @todo: Need unit tests
 */

qx.Class.define("ya.core.api.BaseApi", {

    extend: qx.core.Object,

    type: "abstract",

    events: {
        worker_message  : "",
        worker_error    : "",
        error_logic     : ""
    },

    members: {

        /**
         * Api controller name
         */
        getControllerName: function() {
            throw new Error("The method should be overridden");
        },

        /**
         * Status ready to start
         * @returns {boolean}
         */
        isReady: function() {
            var w = this.getWorker();
            if(!w) {
                return false;
            }
            var rs = ya.core.worker.Worker.STATUS_READY;
            return (w.getStatus() & rs) == rs;
        },

        /**
         * @param e
         * @private
         */
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


        _callMethod: function(msg) {

        },

        _onMessage: function(msg) {
        },

        _onError: function(msg) {
        },

        _onErrorLogic: function() {
            this.warn("Api logic error: ", msg);
        },


        /**
         * Register event handlers
         * @private
         */
        _registerListeners: function() {
            this.addListener("change_worker",   this._onChangeWorker, this);
            this.addListener("worker_message",  this._onChangeWorker, this);
            this.addListener("worker_error",    this._onChangeWorker, this);
            this.addListener("error_logic",    this._onChangeWorker, this);
        }
    }
});