Eqn.Router.reopen({
  location: "history"
});

Eqn.Router.map(function() {
  this.resource("equations", { path: "/" }, function () {
    this.route("help");
    this.route("new", { path: "/" });
    this.route("show", { path: "/:equation_id" });
  });
});

Eqn.ErrorRoute = Ember.Route.extend();

Eqn.EquationsShowRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find("equation", params.equation_id);
  }
});

Eqn.EquationsNewRoute = Ember.Route.extend({
  model: function() {
    var code = Ember.none(Storage) ? null : localStorage.getItem("equations:new:code");

    return this.store.createRecord("equation", {
      code:  Ember.none(code) ? "" : code
    });
  }
});

Eqn.EquationsHelpRoute = Em.Route.extend({
  cachedModel: null,
  model: function() {
    var cached = this.get("cachedModel");

    if (cached) return cached;

    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var opts = {
        url: "/help.md",

        success: function(code) {
          Ember.run(function () {
            var equation = self.store.createRecord("equation", {
              code: code
            });

            self.set("cachedModel", equation);

            resolve(equation);
          });
        },

        error: function() {
          Ember.run(null, reject);
        }
      };

      $.ajax(opts);
    });
  }
});
