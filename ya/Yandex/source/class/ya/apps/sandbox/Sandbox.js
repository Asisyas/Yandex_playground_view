/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.Sandbox", {

    extend: ya.core.application.BaseApplication,

    members: {

        _layer: null,

        init: function() {
            this.base(arguments);
        },

        /**
         * Register app services
         * @private
         */
        registerServices: function() {
            //Register worker as service
            this._addService("sandbox.worker", ya.apps.sandbox.services.worker.WorkerService, null);
        },


        getName: function() {
            return "Yandex-Sandbox"
        },

        getLayer: function() {
            if(!this._layer) {
                this._layer = new ya.apps.sandbox.forms.Layer();
            }
            return this._layer;
        }
    }
});