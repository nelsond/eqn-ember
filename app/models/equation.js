Eqn.ApplicationSerializer = DS.RESTSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  }
});

var attr = DS.attr;
Eqn.Equation = DS.Model.extend({
  code: attr("string"),
  createdAt: attr("number", {
    defaultValue: function() { return Math.floor( (new Date()).getTime()/1000 ); }
  })
});

Eqn.Equation.FIXTURES = [
  {
    id: "d5vgfijq0q",
    title: "First Example Equation",
    code: "This is a beautiful equation: $E=mc^2$",
    created_at: Math.floor( (new Date()).getTime()/1000 )
  },
  {
    id: "m5ns0grwyd",
    title: "Second Example Equation",
    code: "This is another beautiful equation: $F=ma$",
    created_at: Math.floor( (new Date()).getTime()/1000 )
  }
];
