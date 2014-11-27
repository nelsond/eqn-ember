moduleForComponent("on-off-switch");

test("toggles state on click", function() {
  expect(1);

  var component = this.subject(),
      initialState = component.get("switchState");

  this.$();
  click(".switch-container");

  andThen(function () {
    equal(component.get("switchState"), !initialState, "switch toggled state");
  });
});

test("switch state is on/off after clicking the corresponding label", function() {
  expect(2);

  var component = this.subject();

  this.$();
  click(".off");

  andThen(function () {
    equal(component.get("switchState"), false, "switch is off");
  });

  click(".on");

  andThen(function() {
    equal(component.get("switchState"), true, "switch is on");
  });
});
