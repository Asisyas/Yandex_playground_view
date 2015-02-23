/**
 * Created by kost on 18.2.15.
 * The event handler of the Worker
 * @todo: Hellish and very angry crutch. No correct processing of events from Worker
 * @todo: Need unit tests
 */

qx.Class.define("ya.apps.sandbox.controllers.BaseController", {

    extend: qx.core.Object,

    events: {
        "success"  : "qx.event.type.Data",
        "error"    : "qx.event.type.Data"
    },

    statics: {
        ERROR_NONE  :   0,
        ERROR_LOGIC :   1,
        ERROR_WORKER:   2
    },

    construct: function() {
        this.base(arguments);
        this.services = ya.core.Services.getInstance();
        this._registerRoutes();
        this._registerListeners();
    },

    members: {

        services: null,

        __routes: {},

        getName: function() {
            return "base";
        },

        _registerRoutes: function() {
            this.addRoute("controller_error",  this.errorLogicAction);
            this.addRoute("worker_error",      this.controllerErrorAction);
            this.addRoute("index",             this.indexAction);
        },

        /**
         *
         */
        controllerErrorAction: function(workerData) {
            this.createWorkerAnswer(this.self(arguments).ERROR_LOGIC,
                {
                    example_data: {
                        controller  : "base",
                        action      : "index",
                        data        : { param1: "test", param2: "test2" }
                    },
                    message: "Error controller logic. Invalid postMessage"
                });
        },

        /**
         * If logic error
         * @param workerData
         */
        errorLogicAction: function(workerData) {
            this.createWorkerAnswer(this.self(arguments).ERROR_LOGIC, workerData || {});
        },

        /**
         * index action
         * @param workerData
         */
        indexAction: function(workerData) {
            var name = this.getName();
            this.createWorkerAnswer(this.self(arguments).ERROR_NONE,
                {
                    workerData: workerData,
                    message: "Hello world!",
                    controller: name
                });
        },

        htmlAppendAction : function(workerData) {

        },

        htmlAction : function(workerData) {

        },

        /**
         * Create answer structure
         * @param code
         * @param data
         * @returns {{code: (*|number), data: *}}
         */
        createWorkerAnswer: function(code, data) {
            var resp = {
                code    : code,
                data    : data || null
            };
            var statics = this.self(arguments);
            this.fireDataEvent(statics.ERROR_NONE ? "success" : "error",   resp);
        },

        /**
         * Register controller actions
         * @param name
         * @param clbl
         * @private
         */
        addRoute: function(name, clbl) {
            this.__routes[name] = qx.lang.Function.bind(clbl, this);
        },

        /**
         * Return all routes from
         * @returns {*}
         */
        getRoutes: function() {
            return this.__routes;
        },

        _registerListeners: function() {
        }
    }
});