/**
 * Created by kost on 27.02.15.
 */

qx.Class.define("ya.apps.sandbox.controllers.ControllerManager", {

    extend: ya.apps.sandbox.controllers.AbstractControllersManager,

    construct: function(worker) {
        this.base(arguments, worker);
    },

    members: {

        init: function() {
            this.base(arguments);
            var controllers = [
                ya.apps.sandbox.controllers.yandex.YandexMaps
            ];

            this.registerControllers(controllers);
        }
    }

});