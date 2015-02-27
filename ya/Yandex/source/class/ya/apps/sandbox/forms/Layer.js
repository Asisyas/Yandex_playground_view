/**
 * Created by kost on 17.02.15.
 */

qx.Class.define("ya.apps.sandbox.forms.Layer", {

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

        /**
         * Add services container to prototype
         */
        _services: ya.core.Services.getInstance(),

        /**
         * Console window
         */
        __console:  null,

        /**
         * Split panel (source || html)
         */
        __splitPanel:   null,

        /**
         *  Playground iframe
         */
        __playground:   null,

        /**
         *
         */
        __playgroundLayer: null,

        /**
         * Code area form
         */
        __codeArea:     null,

        /**
         * Start application button
         */
        __applyBtn:     null,

        /**
         * Api controller manager
         */
        __controllerManager: null,

        /**
         * Get source from codeArea
         * @returns {String}
         */
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
                var mainMenu = new ya.apps.sandbox.forms.MainMenu();
                this.add(mainMenu);

                // init apply button
                var applyBtn = new qx.ui.form.Button(this.tr("Run"), "resource/ya/test.png");
                mainMenu.add(applyBtn);
                applyBtn.setEnabled(this.getCode() != "");

                var examples = new ya.apps.sandbox.forms.ExamplesWidget();
                mainMenu.add(examples);


                this.__splitPanel = new qx.ui.splitpane.Pane("horizontal");
                this.add(this.__splitPanel, {flex: 1});

                // Play source
                applyBtn.addListener("execute", function() {
                    this._startPlayground();
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

                this.__playgroundLayer = new qx.ui.container.Composite();
                this.__playgroundLayer.setLayout(new qx.ui.layout.Dock());
                this.__splitPanel.add(this.__playgroundLayer,2);

                callback.call(this);
            }, this);
        },

        /**
         * Create new sandbox iframe and dispose old
         * @private
         */
        _initPlayground: function() {
            var cpl = this.__playground;
            if(cpl) {
                this.__playgroundLayer.remove(cpl);
                cpl.dispose();
            }
            var playground = new ya.apps.sandbox.forms.PlaygroundFrame();
            this.__playground = playground;
            this.__playgroundLayer.add(playground);
        },

        /**
         * Start app event handler
         * @private
         */
        _startPlayground: function() {
            var code    = this.getCode();
            var worker  = this._services.service("sandbox.worker").createWorker(code, true);
            this._initPlayground();
            this._initControllerManager(worker);
            //@todo: ... ждем консоль для наблюдений за воркером и контроллер-манагером:)
            worker.addListener("error", function(e) {
                var ed  = e.getData();
                var err = [];
                err.push("Line :" + ed.lineno);
                err.push("Message: " + ed.message);
                alert(err.join("\n"));
            });
            worker.start();
        },

        /**
         * Init manager
         * @param worker
         * @private
         */
        _initControllerManager: function(worker) {
            if(this.__controllerManager) {
                this.__controllerManager.setWorker(worker);
            } else {
                this.__controllerManager = new ya.apps.sandbox.controllers.ControllerManager(worker);
                this._registerCManagerListeners(this.__controllerManager);
            }
        },

        /**
         * Register event handlers
         * @param cm    {ya.apps.sandbox.controllers.AbstractControllersManager}
         * @private
         */
        _registerCManagerListeners: function(cm) {
            cm.addListener("html",          this._playgroundHtml,   this);
        },

        /**
         * Update playground content
         * @param e
         * @private
         */
        _playgroundHtml: function(e) {
            var d           = e.getData();
            var html        = d.html;
            var isAppend    = Boolean(d.append);
            var pl          = this.__playground;
            pl.setContent(html, isAppend);

        },

        _registerListeners: function() {
        }
    }

});