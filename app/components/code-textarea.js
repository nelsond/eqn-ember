var autoCompleteBehavior = function (e) {
  var el = $(this),
    keyCode = e.keyCode || e.which,
    key = String.fromCharCode((96 <= keyCode && keyCode <= 105)? keyCode-48 : keyCode),
    text = el.val(),
    caret = this.selectionStart,
    left = text.substr(0,caret),
    right = text.substring(caret, text.length),
    self = this,
    autoCompletion = [
      { opening: "$", closing: "$" },
      { opening: "{", closing: "}" },
      { opening: "(", closing: ")" }
    ];

  autoCompletion.forEach(function (completion) {
    // add closing
    if (
      e.type == "keypress" &&
      key == completion.opening &&
      ( left.length === 0 || /[^\\]$/.test(left) ) &&
      new RegExp("^[^"+completion.closing+"]?").test(right)
    ) {
      e.preventDefault();
      el.val(left+completion.opening+completion.closing+right);
      self.setSelectionRange(caret+1,caret+1);
    }

    // auto replace closing
    if (
      e.type == "keypress" &&
      key == completion.closing &&
      new RegExp("\\"+completion.opening+"([^"+completion.opening+"])*$").test(left) &&
      new RegExp("^\\"+completion.closing).test(right)
    ) {
      e.preventDefault();
      self.setSelectionRange(caret+1,caret+1);
    }

    // delete opening and closing
    if (
      e.type == "keydown" &&
      keyCode == 8 &&
      new RegExp("\\"+completion.opening+"$").test(left) &&
      new RegExp("^\\"+completion.closing).test(right)
    ) {
      el.val(left.substring(0, left.length-1) + right.substring(1, right.length));
      self.setSelectionRange(caret, caret);
      e.preventDefault();
    }
  });

  // fix double $$ for block math
  if (
    e.type == "keypress" &&
    key == "$" &&
    /\$\$$/.test(left)
  ) { this.setSelectionRange(caret,caret); }

  // indentation on tab
  if (
    e.type == "keydown" &&
    keyCode == 9 &&
    (left.length === 0 || /\n\s*$/.test(left))
  ) {
    el.val(left + "  " + right);
    this.setSelectionRange(caret+2, caret+2);
    e.preventDefault();
  }

  // indentation after enter
  if (
    e.type == "keydown" &&
    keyCode == 13
  ) {
    var match = left.match(/\n?(\s*)[^\n\s][^\n]*$/);

    if (match && match.length == 2) {
      var indent = match[1],
          level = indent.length/2;

      if (indent.length % 2 === 0) {
        e.preventDefault();
        el.val(left + "\n" + indent + right);
        this.setSelectionRange(caret+indent.length+1, caret+indent.length+1);
      }
    }
  }
};

var selectionStartSupported = !Ember.none($("<textarea/>").prop("selectionStart"));

Eqn.CodeTextareaComponent = Ember.TextArea.extend({
  becomeFocused: function() {
    this.$().focus();

    if (selectionStartSupported) {
      this.$().on("keypress", autoCompleteBehavior);
      this.$().on("keydown", autoCompleteBehavior);
    }
  }.on("didInsertElement"),
  destroyEditor: function() {
    if (selectionStartSupported) {
      this.$().off("keypress", autoCompleteBehavior);
      this.$().off("keydown", autoCompleteBehavior);
    }
  }.on("willDestroyElement")
});
