/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.PlaygroundFrame", {

    extend: qx.ui.embed.Iframe,

    include : qx.ui.core.MBlocker,

    construct: function() {
        this.base(arguments, null);
        this._registerListeners();
    },

    members:{

        appendContent: function(content) {
            var cnt = this.getContentElement().getAttribute("srcdoc") || "";
            cnt += content;
            this.setContent(cnt);
        },

        setContent: function(content) {
            this.getContentElement().setAttribute("srcdoc", content);
        },

        /**
         * Block all events handlers
         * @private
         */
        _onLoad: function() {
            this.block();
            var contentElem = this.getContentElement();
            contentElem.setAttribute("sandbox", "allow-same-origin");
        },

        _registerListeners: function() {
            this.addListener("load", this._onLoad, this)
        }
    }

});