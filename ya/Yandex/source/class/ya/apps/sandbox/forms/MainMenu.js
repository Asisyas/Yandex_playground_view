/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.forms.MainMenu", {

    extend : qx.ui.container.Composite,

    construct: function() {
        this.base(arguments, new qx.ui.layout.HBox());
    },

    members: {
        add: function(item) {
            this.base(arguments, item);
            this.base(arguments, new qx.ui.core.Spacer(10));
        }
    }
});