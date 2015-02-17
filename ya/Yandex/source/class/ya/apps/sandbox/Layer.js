/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.Layer", {

    extend: qx.ui.container.Composite,

    events: {
        "CODE_CHANGE"      : "qx.event.type.Data"
    },

    construct: function() {
        this.base(arguments);

        var layout = new qx.ui.layout.VBox();
        this.setLayout(layout);

        this._createForm(function() {
            this._registerListeners();
        }, this);
    },

    members: {

        __splitPanel:   null,

        __playground:   null,

        __codeArea:     null,

        __applyBtn:     null,


        getCode: function() {
            return this.__codeArea ? this.__codeArea.getCode(): "";
        },

        /**
         * Create form items
         * @param callback {Function}
         * @private
         */
        _createForm: function(callback) {
            ya.forms.CodeArea.loadAce(function() {

                var mainMenu = new ya.apps.sandbox.MainMenu();
                this.add(mainMenu);

                // init apply button
                var applyBtn = new qx.ui.form.Button(this.tr("Run playground"), "resource/ya/test.png");
                mainMenu.add(applyBtn);
                applyBtn.setEnabled(this.getCode() != "");


                this.__splitPanel = new qx.ui.splitpane.Pane("horizontal");
                this.add(this.__splitPanel, {flex: 1});

                // Play source
                applyBtn.addListener("execute", function() {
                    this.fireDataEvent("RUN_PLAYGROUND");
                }, this);
                // Change code
                this.addListener("CODE_CHANGE", function() {
                    this.__applyBtn.setEnabled(this.getCode() != "");
                }, this);
                this.__applyBtn = applyBtn;

                // init code area
                var codeArea = new ya.forms.CodeArea();
                this.__splitPanel.add(codeArea,1);
                codeArea.init();
                codeArea.useHighlight(true);
                codeArea.addListener("keyup", function(e) {
                    this.fireDataEvent("CODE_CHANGE");
                }, this);
                this.__codeArea = codeArea;

                // init playground iframe
                var playground = new ya.apps.sandbox.PlaygroundFrame();

                this.__splitPanel.add(playground,2);
                this.__playground = playground;

                callback.call(this);
            }, this);
        },

        _registerListeners: function() {
        }
    }

});