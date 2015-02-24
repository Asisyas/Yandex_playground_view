/**
 * Created by kost on 24.02.15.
 */

qx.Class.define("ya.core.UIKernel", {

    extend: qx.core.Object,

    type: "singleton",

    properties: {
        /**
         * Applications root
         */
        root:       { init: null,       check: "qx.ui.core.LayoutItem",     event: "change_root" }
    },

    members: {

        /**
         * {qx.ui.root.Application}
         */
        __windowRoot    : null,

        /**
         * Initialized ?
         */
        __status        : false,

        /**
         *
         * @param windowRoot {qx.ui.root.Application} Window Root window
         */
        init: function(windowRoot) {
            //@todo: normalize
            if(this.__status) {
                this.warn("Already initializaed");
                return;
            }
            if(!windowRoot) {
                throw new Error("windowRoot == null");
            }
            if(!(windowRoot instanceof qx.ui.root.Application)) {
                throw new Error("windowRoot not instance qx.ui.root.Application");
            }
            this.__windowRoot = windowRoot;
            this.__status = true;
            this.debug("Load UI");
        },

        /**
         * Remove layout from root
         * @param layout {qx.ui.core.LayoutItem}
         */
        remove: function(layout) {
            var r = this.getRoot();
            if(!layout) {
                this.warn("empty layout");
            }

            if(!r || !layout) {
                return;
            }
            r.remove(layout);
        },

        /**
         * Display layout
         * @param layout {qx.ui.core.LayoutItem}
         */
        display: function(layout) {
            var r = this.getRoot();
            if(!layout || !r) {
                this.warn("Logic warning");
                return;
            }
            r.add(layout);

        },

        /**
         * Trigger
         * @param e     {qx.event.type.Data}
         * @private
         */
        _onChangeRoot: function(e) {
            var с = e.getData(),
                o = e.getOldData();

            if(o) {
                this.debug("Destroy old root");
                this.__windowRoot.remove(o);
            }
            this.__windowRoot.add(c, { edge: 0 });
            this.debug("Init root");
        },

        /**
         * Register all UIKernel triggers
         * @private
         */
        _registerListeners: function() {
            this.addListener("change_root", this._onChangeRoot, this);
        }
    }
});