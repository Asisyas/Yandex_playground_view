/**
 * Created by kost on 27.02.15.
 * @todo: load examples config (not hard-code)
 * @asset(resource/ya/sandbox/*)
 */

qx.Class.define("ya.apps.sandbox.forms.ExamplesWidget", {
    extend: qx.ui.form.SelectBox,

    construct: function() {
        this.base(arguments);

        var litm = new qx.ui.form.ListItem("Item 1", null, "resource/ya/sandbox/ya-geocoder.js");
        this.add(litm);
    },


    members: {
        /**
         * @todo: Load list from remote
         * @private
         */
        _init: function(callback) {
            var list = [
                {
                    name    : 'Yandex Geocoder',
                    source  : 'resource/ya/sandbox/ya-geocoder.js'
                }
            ];
            callback.call(null, list);
        }
    }
});