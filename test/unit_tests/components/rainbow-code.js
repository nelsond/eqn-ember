moduleForComponent("rainbow-code");

test("syntax highlighting for tex", function(){
  expect(2);

  var component = this.subject();

  Ember.run(function() {
    component.set("language", "tex");
    component.set("code", "\\frac{1}{2}");
  });

  var code = this.$().find("pre.rainbow");
  equal(code.length, 1);

  var expectedHtml = '<span class="command">\\frac</span><span class="bracket">{</span><span class="content">1</span><span class="bracket">}</span><span class="bracket">{</span><span class="content">2</span><span class="bracket">}</span>';
  equal(code.html(), expectedHtml);
});

test("syntax higlighting after updating language or code", function () {
  expect(4);

  var stripHtml = TestHelper.stripHtml;

  var getHtml = function(target) {
    return target.$().find("pre.rainbow").html();
  };

  var component = this.subject();

  Ember.run(function() {
    component.set("language", "tex");
    component.set("code", "\\frac{1}{2}");
  });

  var htmlTex = getHtml(this);

  Ember.run(function() {
    component.set("language", "default");
  });

  var htmlDefault = getHtml(this);
  notEqual(htmlTex, htmlDefault);
  equal(stripHtml(htmlTex), stripHtml(htmlDefault));

  Ember.run(function() {
    component.set("code", "");
  });

  var htmlEmpty = getHtml(this);
  notEqual(htmlTex, htmlEmpty);
  notEqual(stripHtml(htmlTex), stripHtml(htmlEmpty));
});
