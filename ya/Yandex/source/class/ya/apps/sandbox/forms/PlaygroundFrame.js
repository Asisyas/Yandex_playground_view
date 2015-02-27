/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.forms.PlaygroundFrame", {

    extend: qx.ui.embed.Iframe,

    include : qx.ui.core.MBlocker,

    events: {
        "_content_set"      : "qx.event.type.Data"
    },

    construct: function(source) {
        this.base(arguments, source);
        this.__srcContent = "";
        this._registerListeners();
    },

    members:{

        __srcContent: "",

        getContent: function() {
            return this.__srcContent;
        },

        setContent: function(content, isAppend) {
            var src = "";
            if(isAppend) {
                src = this.getContent();
            }
            src += content;
            this.__srcContent = src;
            this.fireDataEvent('_content_set');
        },


        _setContent: function() {
            var src = this.getContent();
            this.getContentElement().setAttribute('srcdoc', src);
        },

        /**
         * Block all events handlers
         * @private
         */
        _onLoad: function() {
            this.block();
            var contentElem = this.getContentElement();
            contentElem.setAttribute("sandbox", "allow-same-origin");
            this._setContent();
        },

        _registerListeners: function() {
            this.addListener("appear", function() {
                this._onLoad();
                this.addListener("_content_set", this._setContent, this);
            }, this);
        }
    }

});