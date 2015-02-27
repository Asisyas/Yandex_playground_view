/**
 * Created by kost on 27.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.AbstractController", {

    extend: qx.core.Object,

    events: {

        /**
         * Fired when success
         */
        "success"  : "qx.event.type.Data",

        /**
         * Fired when error
         */
        "error"    : "qx.event.type.Data"
    },

    statics: {
        /**
         * Response success
         */
        ERROR_NONE  :   0,

        /**
         * Error logic statuc
         */
        ERROR_LOGIC :   1,

        /**
         *  Worker error
         */
        ERROR_WORKER:   2,

        /**
         * Controller string reference
         * @returns {string}
         */
        getName: function() {
            throw new Error("Method must be overridden");
        }
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

        /**
         * Register controller routing
         * @private
         */
        _registerRoutes: function() {
            // error logic action
            this.addRoute("controller_error",   this.errorLogicAction);
            // catch worker errors
            this.addRoute("worker_error",       this.controllerErrorAction);
            // default action
            this.addRoute("index",              this.indexAction);
            // insert html to iframe
            this.addRoute("html",               this.htmlAction);
            // append html to iframe
            this.addRoute("append_html",        this.htmlAppendAction)
        },

        call: function(route, data) {
            var callback = this.getRoute(route) ||
                this.getRoute('controller_error');
            callback.call(null, data);

        },


        /**
         *  if Worker send incorrect data
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

        /**
         * Append html to sandbox iframe
         * @param workerData {Map}
         */
        htmlAppendAction : function(workerData) {

        },

        /**
         * Set data to sandbox iframe
         * @param workerData {Map}
         */
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
            this.fireDataEvent(statics.ERROR_NONE === code ? "success" : "error",   resp);
        },

        /**
         * Register controller actions
         * @param name
         * @param clbl
         * @private
         */
        addRoute: function(name, clbl) {
            this.debug("Register route " + name);
            this.__routes[name] = qx.lang.Function.bind(clbl, this);
        },

        /**
         * Return all routes from
         * @returns {*}
         */
        getRoutes: function() {
            return this.__routes;
        },

        /**
         * Get route callback by string reference
         * @param name
         * @returns {Function | null}
         */
        getRoute: function(name) {
            return this.__routes[name];
        },

        /**
         * Register triggers
         * @private
         */
        _registerListeners: function() {
        }
    }

});