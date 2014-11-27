var math = function(converter) {
  return [{
    type: "lang",
    filter: function(source) {
      source = source.replace(/\\~D/gm, "$");
      return source.replace(/(~D~D|~D)((?:(?!~D).)*)(~D~D|~D)/gm, function (match, preType, tex, postType) {
        if(tex.length < 1) { return ""; }

        var math,
            isDisplayStyle = (preType == "~D~D" && postType == "~D~D");
        try {
          if (isDisplayStyle) {
            math = katex.renderToString("\\displaystyle { " + tex + " }");
          } else {
            math = katex.renderToString(tex);
          }
        }
        catch (err) {
          math = "<span class=\"katex-error\">" + err.message + "</span>";
        }

        if (isDisplayStyle) { math = "<span class=\"katex-displaystyle\">" + math + "</span>"; }

        if (preType == "~D~D" && postType == "~D") { math = "~D" + math; }
        if (preType == "~D" && postType == "~D~D") { math = math + "~D"; }

        return math;
      });
    }
  }];
};

var inlineCode = function(converter) {
  return [{
    type: "lang",
    filter: function(source) {
      return source.replace(/`((?:[^`\\]|\\.)*)`/, function(match, code) {
        return "<code>" + code + "</code>";
      });
    }
  }];
};

var showdown = new Showdown.converter({
  extensions: [math, inlineCode]
});

Ember.Handlebars.helper("renderEquation", function(code) {
  var html = showdown.makeHtml(code);

  return new Ember.Handlebars.SafeString(html);
});

Ember.Handlebars.helper("formatTimestamp", function(ts) {
  return moment.unix(ts).calendar();
});
