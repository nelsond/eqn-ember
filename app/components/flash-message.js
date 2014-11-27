var hideFlash = function() {
  this.$().find("#flash").addClass("hidden");
};

var resetFlash = function() {
  this.$().find("#flash").removeClass("hidden");
  this.set("message", null);
};

Eqn.FlashMessageComponent = Ember.Component.extend({
  message: null,
  messageObserver: function() {
    var message = this.get("message");

    if (message) {
      var duration = Eqn.TRANSITION_DURATION;

      this.$().show();

      Ember.run.debounce(this, hideFlash, duration*4);
      Ember.run.debounce(this, resetFlash, duration*4+duration);
    } else {
      this.$().hide();
    }
  }.observes("message"),

  hideFlash: function() {
    this.$().hide();
  }.on("didInsertElement")
});
