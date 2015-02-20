/**
 * Created by kost on 19.02.15.
 */


qx.Class.define("ya.core.api.ApiKernel", {

    extend: qx.core.Object,

    construct: function() {
        this.base(arguments);

        this._registerApplications();
    },

    members: {

        __apps: {},

        _registerApplications: function() {
            this.__apps["yandex_maps"] = ya.apps.sandbox.controllers.yandex.YandexMaps;
        }

    }

});