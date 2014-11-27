Ember.LOG_VERSION = false;

window.Eqn = Ember.Application.create({
  TRANSITION_DURATION: 250
});

Eqn.EquationAdapter = DS.RESTAdapter.extend({
  namespace: "api/v1"
});
