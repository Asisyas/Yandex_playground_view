/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.Sandbox", {

    extend: ya.core.application.BaseApplication,

    members: {

        _layer: null,

        start: function(callback) {
            this.base(arguments);
            callback.call(this);
        },

        getLayer: function() {
            if(!this._layer) {
                this._layer = new ya.apps.sandbox.Layer();
            }
            return this._layer;
        }
    }
});