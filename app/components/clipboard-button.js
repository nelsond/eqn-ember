// google closure compiler flash detection

var getFlashVersion = function () {
  var a = false,
  b = "",
  c = function(d) {
    d = d.match(/[\d]+/g);
    d.length = 3;
    return d.join(".");
  };

  if (navigator.plugins && navigator.plugins.length) {
    var e = navigator.plugins["Shockwave Flash"];
    e && (a = !0, e.description && (b = c(e.description)));
    navigator.plugins["Shockwave Flash 2.0"] && (a = !0, b = "2.0.0.11")
  } else {
    if (navigator.mimeTypes && navigator.mimeTypes.length) {
      var f = navigator.mimeTypes["application/x-shockwave-flash"];
      (a = f && f.enabledPlugin) && (b = c(f.enabledPlugin.description))
    } else {
      try {
        var g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
        a = !0;
        b = c(g.GetVariable("$version"));
      } catch (h) {
        try {
          g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
          a = !0;
          b = "6.0.21";
        } catch (i) {
          try {
            g = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            a = !0;
            b = c(g.GetVariable("$version"));
          } catch (j) {}
        }
      }
    }
  }
  return (a ? b : false);
};

var selectAll = function(e) {
  e.preventDefault();
  this.select();
};

ZeroClipboard.config({
  swfPath: "static/ZeroClipboard.swf",
  forceHandCursor: true
});

Eqn.ClipboardButtonComponent = Ember.Component.extend({
  buttonText: "<span class=\"octicon octicon-clippy\"></span>",
  tooltipText: "Copy",
  clipboardText: "Some random text.",

  isCopied: false,
  hasFlash: true,

  initializeZeroClipboard: function() {
    this.$().find("input").on("click", selectAll);
    this.$().find("input").on("keydown", selectAll);

    if (getFlashVersion()) {
      var client = new ZeroClipboard(),
      self = this;

      var removeHighlight = function() {
        self.set("isCopied", false);
      };

      client.on("copy", function(event) {
        self.set("isCopied", true);

        var clipboard = event.clipboardData,
        text = self.get("clipboardText");

        clipboard.setData("text/plain", text);
        if (text.match(/^[a-z]+:\/\//i)) {
          clipboard.setData("text/html", "<a href=\""+text+"\">"+text+"</a>");
        }
      });

      client.clip(this.$().find("button"));
    } else {
      this.set("hasFlash", false);
    }
  }.on("didInsertElement"),

  destroyZeroClipboard: function() {
    this.$().find("input").off();
    if (getFlashVersion()) ZeroClipboard.destroy();
  }.on("willDestroyElement")
});
