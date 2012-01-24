$(function(){
    var Person = Backbone.Model.extend({
        defaults: {
            name: 'Fetus',
            age: 0,
            children: []
        },
        initialize: function(){
            this.bind("change:name", function(){
                var name = this.get("name"); // 'Stewie Griffin'
                console.log("Changed my name to " + name );
            });
        },
        adopt: function( newChildsName ){
            var children_array = this.get("children");
            children_array.push( newChildsName );
            this.set({
                children: children_array
            });
        },
        setName: function( name ){
            this.set({ name: name });
        }
    });
    
    var person = new Person({
        name: "Thomas", 
        age: 67
    });
    
    person.setName("blah");
    person.set({name: 'Jose'});
    person.adopt('Martin'); 
    person.adopt('Jose'); 
    console.log(person.toJSON());
});