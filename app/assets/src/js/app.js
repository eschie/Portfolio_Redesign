var template = function(id){
    return _.template( $('#' + id).html() );
};


// Person Model
var Person = Backbone.Model.extend({
    defaults:{
        name: 'John Doe',
        age: 30,
        occupation: 'worker'
    }
});

// A List of People
var PeopleCollection = Backbone.Collection.extend({
    model: Person
});

// View for all people
var PeopleView = Backbone.View.extend({
    tagName: 'ul',

    render: function() {
        this.collection.each(function(person){
            var personView = new PersonView({ model: person });
            this.$el.append(personView.render().el);
        }, this); // context as second argument

        return this;
    }
});

var PersonView = Backbone.View.extend({
    tagName: 'li',

    template: template('personTemplate'),

    render: function () {
        this.$el.html( this.template(this.model.toJSON()) );
        return this; // always return this from render methods to continue chaining
    }
});

var person = new Person;

var peopleCollection = new PeopleCollection([
{
    name: 'Jeffrey Way',
    age:27
},
{
    name: 'Austin Eschenbach',
    age: 24
},
{
    name: 'Margaret Atwood',
    age:58
}
]);

var peopleView = new PeopleView({ collection: peopleCollection });
$('.content-container').append(peopleView.render().el);