/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.MainMenu", {

    extend : qx.ui.container.Composite,

    construct: function() {
        this.base(arguments, new qx.ui.layout.HBox());
        this.add(new qx.ui.core.Spacer(10));
    }
});