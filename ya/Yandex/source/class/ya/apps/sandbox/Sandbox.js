/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.Sandbox", {

    extend: ya.core.application.BaseApplication,

    members: {

        _layer: null,

        init: function() {
            this.base(arguments);
            this._registerServices();
        },

        /**
         * Register app services
         * @private
         */
        _registerServices: function() {
            ya.core.Services.getInstance().addService(
                //Register worker as service
                {
                    name: "sandbox.worker",
                    clazz: ya.apps.sandbox.services.worker.WorkerService,
                    args: null
                }
            );
        },

        getLayer: function() {
            if(!this._layer) {
                this._layer = new ya.apps.sandbox.forms.Layer();
            }
            return this._layer;
        }
    }
});