/**
 * Created by kost on 23.02.15.
 */

qx.Class.define("ya.core.application.BaseService", {
    extend: qx.core.Object,
    type: "abstract",

    construct: function() {
        this.base(arguments);
        this.debug("Create new service instance");
    }
});