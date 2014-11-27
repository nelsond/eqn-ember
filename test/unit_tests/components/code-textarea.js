moduleForComponent("code-textarea");

var keyCode = function(key) {
  return {
    "a": 65,
    "$": 36,
    "(": 40,
    "{": 123,
    ")": 41,
    "}": 125,
    "enter": 13,
    "tab": 9,
    "backspace": 8
  }[key];
};

test("autocomplete for math", function() {
  expect(3);

  var component = this.subject();
  var textarea = this.$();

  keyEvent(textarea, "keypress", keyCode("$"));

  andThen(function() {
    equal(textarea.val(), "$$", "added closing $");
  });

  keyEvent(textarea, "keydown", keyCode("backspace"));
  andThen(function() {
    equal(textarea.val(), "", "deleted opening and closing $");
  });

  ["$", "$", "("].forEach(function (character) {
    keyEvent(textarea, "keypress", keyCode(character));
  });
  andThen(function() {
    equal(textarea.val(), "$$()$$", "fixed double $");
  });
});

test("autocomplete for brackets", function() {
  expect(2);

  var component = this.subject();
  var textarea = this.$();

  keyEvent(textarea, "keypress", keyCode("("));
  andThen(function() {
    equal(textarea.val(), "()", "added closing )");
  });

  keyEvent(textarea, "keypress", keyCode(")"));
  andThen(function() {
    equal(textarea.val(), "()", "replaced autocompleted )");
  });
});

test("indentation using tab", function () {
  expect(2);

  var component = this.subject();
  var textarea = this.$();

  keyEvent(textarea, "keydown", keyCode("tab"));
  andThen(function() {
    equal(textarea.val(), "  ", "indented using soft tabs");
  });

  fillIn(textarea, "  test");
  keyEvent(textarea, "keydown", keyCode("enter"));
  andThen(function() {
    equal(textarea.val(), "  test\n  ", "indented new line");
  });
});
