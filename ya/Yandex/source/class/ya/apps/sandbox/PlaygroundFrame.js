/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.PlaygroundFrame", {

    extend: qx.ui.embed.Iframe,

    construct: function() {
        this.base(arguments, null);
        var contentElem = this.getContentElement();
        contentElem.setAttribute("sandbox");
    },

    members:{

        setContent: function(content) {
            this.getContentElement().setAttribute("srcdoc", content);
        }

    }

});