App = {
    start: function(){
        //inicializo el view para el search
        new App.PersonRouter();
    }  
};

App.Person = Backbone.Model.extend({});
App.PersonCollection = Backbone.Collection.extend({
    model: App.Person
});

App.PersonList = new App.PersonCollection();

App.PersonRouter = Backbone.Router.extend({
    initialize: function(){
        new App.PersonFormView({ router: this });
        new App.PersonListView();
    }
});

App.PersonFormView = Backbone.View.extend({
    el: '#formPersona',
    events:{
        'submit': 'handleSubmit'
    },
    initialize: function(){
        this.router = this.options.router;  //options tienen todo lo que se le pasa por parametro
        //$(this.el).focus();
        this.$('#first_name').focus();
    },
    handleSubmit: function(){
        var Person = new App.Person();
        Person.set({firstName: this.$('#first_name').val(), 
                    lastName: this.$('#last_name').val()
                   });
        
        App.PersonList.add(Person);
        return false;
    }
})

//Un registro de la lista
App.PersonListRecordView = Backbone.View.extend({
    tagName: 'li',
    
    initialize: function(){
        this.template = _.template($("#personListRecord").html());
        this.render();
    },
    
    events: {
        'click span.remove' : 'removeRecord',
        'click span.edit'   : 'editRecord'
    },
    
    removeRecord: function(){
        console.log('Remove record');
    },
    
    editRecord: function(){
        console.log('edit Record');
    },
    
    render: function(){
        var html = this.template({
            model: this.model.toJSON()
            });
        console.log(html);
        $(this.el).append(html);
    }
})

App.PersonListView = Backbone.View.extend({
    el: '#person-list',
    initialize: function(){
        App.PersonList.bind('add', this.renderItem, this);
        
    },
    renderItem: function(model){$(this.el).show()

        var view = new App.PersonListRecordView({
            model : model
        })
        this.$('ul').append(view.el)
    }
})