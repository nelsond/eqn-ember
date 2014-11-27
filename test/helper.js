Eqn.setupForTesting();
Eqn.injectTestHelpers();

Eqn.reopen({
  TRANSITION_DURATION: 0
});

// ember-qunit
emq.globalize();
setResolver(Ember.DefaultResolver.create({namespace: Eqn}));

// add ember-testing div
if ($("#ember-testing").length === 0) {
  var emberTestingDiv = $("<div/>")
  .attr("id", "ember-testing");

  $("body").append(emberTestingDiv);
}

Eqn.rootElement = "#ember-testing";

$.mockjaxSettings.logging = false;

TestHelper = {
  timestamp: function() {
    var date;

    if (arguments.length == 1) {
      date = arguments[0];
    } else {
      date = new Date();
    }

    return date;
  },

  stubEndpointForHttpRequest: function(path, type, json) {
    $.mockjax({
      url: "/api/v1" + path,
      type: type,
      dataType: "json",
      responseText: json,
      responseTime: 1
    });
  },

  stubEquation: function(id, code, timestamp) {
    this.stubEndpointForHttpRequest("/equations/"+id, "GET", {
      equation: {
        id: id,
        code: code,
        timestamp: timestamp || this.timestamp()
      }
    });
  },

  stripHtml: function(html) {
    var container = document.createElement("div");
    container.innerHTML = html;

    return container.textContent;
  },

  strip: function(string) {
    return string.replace(/^\s+|\s+$/g, "");
  }
};
