Eqn.OnOffSwitchComponent = Ember.Component.extend({
  switchState: false,

  bindToggle: function() {
    var self = this;
    var setSwitchState = function(switchState) {
      return function(e) {
        e.stopPropagation();
        self.set("switchState", switchState);
      };
    };

    this.$().on("click", function() {
      self.toggleProperty("switchState");
    });

    this.$().find("span.on").on("click", setSwitchState(true));
    this.$().find("span.off").on("click", setSwitchState(false));
  }.on("didInsertElement"),

  unbindToggle: function() {
    this.$().off();

    this.$().find(".on").off();
    this.$().find(".off").off();
  }.on("willDestroyElement")
});

