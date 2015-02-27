/**
 * Created by kost on 18.2.15.
 * The event handler of the Worker
 * @todo: Hellish and very angry crutch. No correct processing of events from Worker
 * @todo: Need unit tests
 */

qx.Class.define("ya.apps.sandbox.controllers.BaseController", {

    extend: ya.apps.sandbox.controllers.AbstractController,

    statics: {
        /**
         * Get string reference
         * @returns {string}
         */
        getName: function() {
            return 'base';
        }
    },

    construct: function() {
        this.base(arguments);
    },

    members: {

        /**
         * Register controller routing
         * @private
         */
        _registerRoutes: function() {
            this.base(arguments);
        }
    }
});