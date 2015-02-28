/**
 * Created by kost on 27.02.15.
 * @todo: load examples config (not hard-code)
 * @asset(ya/sandbox/*)
 */

qx.Class.define("ya.apps.sandbox.forms.ExamplesWidget", {

    extend: qx.ui.form.SelectBox,

    events: {
        "example_source_change"         : "qx.event.type.Data",
        "example_source_change_error"   : "qx.event.type.Data"
    },

    construct: function() {
        this.base(arguments);
        this._init();
    },


    members: {

        /**
         * Init widget
         * @private
         */
        _init: function() {
            this._registerListeners();
            this._loadExamplesList(qx.lang.Function.bind(function(list) {
                this.addExamples(list);
            }, this))
        },

        /**
         * Add examples collection
         * @param list {Array}
         */
        addExamples: function(list) {
            var ll = list.length;
            for(var i = 0; i < ll; i++) {
                var tmp = list[i];
                this.add(tmp.name, tmp.source);
            }
        },

        /**
         * Add example
         * @param name      {String} example name
         * @param source    {String} example source href
         */
        add: function(name, source) {
            var litm = new qx.ui.form.ListItem(name, null, source);
            this.base(arguments, litm);
        },

        /**
         * @todo: Load list from remote
         * @private
         */
        _loadExamplesList: function(callback) {
            var list = [
                {
                    name    : 'Yandex Geocoder',
                    source  : 'resource/ya/sandbox/ya-geocoder.txt'
                }
            ];
            callback.call(null, list);
        },

        /**
         *
         * @param e
         * @private
         */
        _loadExampleSource: function(e) {
            var items       = e.getData();
            var item        = items[0];
            var itemModel   = item.getModel();

            var req = new qx.io.remote.Request(itemModel, 'GET', 'text/plain');
            req.addListener("completed",    this._remoteCompleted, this);
            req.addListener("failed",       this._remoteCompleted, this);
            req.addListener("aborted",      this._remoteCompleted, this);
            req.addListener("timeout",      this._remoteCompleted, this);
            req.send();
        },

        _remoteCompleted: function(e) {
            var type = e.getType();
            if(type == "completed") {
                this.fireDataEvent("example_source_change", e.getContent());
                return;
            }
            this.fireDataEvent("example_source_change_error", e);
            return;
        },

        _registerListeners: function() {
            this.addListener("changeSelection", this._loadExampleSource, this);
        }
    }
});