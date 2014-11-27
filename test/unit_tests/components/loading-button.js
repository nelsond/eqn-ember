moduleForComponent("loading-button");

test("shows button text and is visible by default", function(){
  expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set("buttonText", "Test");
  });

  var loadingButton = this.$().find(".loading-button");

  equal(TestHelper.strip(loadingButton.text()), "Test", "Button has text");
  equal(loadingButton.hasClass("visible"), true, "Button is visible");
});

test("changes loading state and indicator", function (){
  expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set("buttonText", "Test");
    component.set("isLoading", true);
  });

  var loadingButton = this.$().find(".loading-button");

  equal(loadingButton.find("span").length, 3, "button shows loading indicator (3 dots)");

  Ember.run(function() {
    component.set("isLoading", false);
  });

  equal(loadingButton.find("span").length, 0, "button doesn't show loading indicator anymore");
});

test("triggers external action and transfers to loading state when button is clicked", function() {
  expect(2);

  var component = this.subject();

  var targetObject = {
    externalAction: function(){
      ok(true, "external Action was called");
    }
  };

  component.set("action", "externalAction");
  component.set("targetObject", targetObject);
  this.$();

  click(".loading-button");

  andThen(function() {
    equal(component.get("isLoading"), true, "button is in loading state");

    // if action is triggered more than once we will trigger three asserts
    // which makes this test fail.
    click(".loading-button");
  });
});
