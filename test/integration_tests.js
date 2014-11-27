module("integration tests", {
  teardown: function() {
    Eqn.reset();
  }
});

test("shows new equation form and preview", function() {
  visit("/");

  andThen(function() {
    equal(find("#editor textarea").length, 1, "page should have syntax textarea");
    equal(find("#preview .markdown").length, 1, "page should have preview");
  });
});

test("shows preview on input", function() {
  expect(2);

  visit("/");
  fillIn("#editor textarea", "$\\int$ $$\\int$$");

  andThen(function() {
    equal(find("#preview .markdown .katex").length, 2, "preview should contain inline and displaystyle KaTex");
    equal(find("#preview .markdown .katex-displaystyle").length, 1, "preview should contain displaystyle KaTex");
  });
});

test("shows katex errors", function() {
  expect(1);

  visit("/");
  fillIn("#editor textarea", "$\\invalid$");

  andThen(function() {
    equal(find("#preview .markdown .katex-error").length, 1, "preview should show KaTex error");
  });
});

test("saves new equation", function () {
  var code = "# This is a heading";

  TestHelper.stubEndpointForHttpRequest("/equations", "POST", {
    equation: {
      id: "abcd",
      code: code,
      created_at: TestHelper.timestamp()
    }
  });

  visit("/");
  fillIn("#editor textarea", code);
  click(".save a");

  andThen(function() {
    equal(find("#equation .markdown h1").length, 1, "equation should have a heading");
  });
});

test("does not save empty equation", function() {
  visit("/");
  click(".save a");

  andThen(function() {
    equal(find("#equation").length, 0, "page should not contain an equation");
  });
});

test("shows equation with id given", function () {
  var id = "abcd";

  TestHelper.stubEquation(id, "# This is a heading");
  visit("/"+id);

  andThen(function() {
    notEqual(
      find(".meta").text().match(/[0-9]{1,2}:[0-9]{2}\s(AM|PM)[^\d]*[0-9]+\schars/i),
      null,
      "The page should contain equation meta data"
    );

    equal(find("#equation").length, 1, "page should not contain the equation");
    equal(find("#equation .markdown h1").length, 1, "equation should have a heading");
  });
});

test("shows source of equation", function () {
  var id = "abcd",
      code = "# This is a heading";

  TestHelper.stubEquation(id, code);
  visit("/"+id);
  click(".switch");

  andThen(function() {
    equal(find("#equation pre").html(), code, "source should be shown");
  });
});

test("shows and caches help file", function () {
  expect(2);

  var mockHelpText = function(text) {
    $.mockjax({
      url: "/help.md",
      type: "GET",
      dataType: "text",
      responseTime: 0,
      responseText: text
    });
  };

  mockHelpText("test");
  visit("/help");

  andThen(function() {
    equal(TestHelper.stripHtml(find("#equation.help .markdown").html()), "test", "help text should be shown");
  });

  mockHelpText("test 2");
  andThen(function() {
    equal(TestHelper.stripHtml(find("#equation.help .markdown").html()), "test", "help text is cached");
  });
});
