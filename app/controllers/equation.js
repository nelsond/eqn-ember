Eqn.EquationsController = Ember.ObjectController.extend({
  needs: "application",
  isLoading: false,
  flashMessage: Ember.computed.alias("controllers.application.flashMessage")
});

Eqn.EquationsNewController = Eqn.EquationsController.extend({
  isValid: false,
  validObserver: function() {
    var isValid = (this.get("code") || "").replace(/^[\s]+$/gm, "").length > 0;
    this.set("isValid", isValid);
  }.observes("code"),

  valuesObserver: function() {
    if (!Ember.none(Storage)) localStorage.setItem("equations:new:code", this.get("code"));
  }.observes("code"),

  actions: {
    createEquation: function() {
      var self = this;

      if (!this.get("isValid")) {
        self.set("flashMessage", "Can't save empty equation");
        return;
      }

      this.set("isLoading", true);
      var equation = this.store.createRecord("equation", {
        code: this.get("code")
      });

      if (!Ember.none(Storage)) localStorage.removeItem("equations:new:code");

      equation.save().then(function(equation) {
        self.set("isLoading", false);
        self.set("flashMessage", "Created new equation");
        self.transitionToRoute("equations.show", equation);
      });
    }
  }
});

Eqn.EquationsShowController = Eqn.EquationsController.extend({
  showCode: false,

  currentUrl: null,
  currentPathDidChange: function() {
    var host = window.location.href.match(/^(https?:\/\/[^/]+)/)[1];
    this.set("currentUrl", host + "/" + this.get("model.id"));
  }.observes("currentPath"),

  continueIsAvailable: false,
  continueObserver: function() {
    var continueIsAvailable = !Ember.none(Storage) && !Ember.empty(localStorage.getItem("equations:new:code"));
    this.set("continueIsAvailable", continueIsAvailable);
  }.observes("code"),

  actions: {
    forkEquation: function() {
      if (!Ember.none(Storage)) localStorage.setItem("equations:new:code", this.get("code"));

      this.set("flashMessage", "Forked equation #" + this.get("id"));
      this.transitionToRoute("equations.new");
    }
  }
});

Eqn.EquationsHelpController = Eqn.EquationsShowController.extend();
