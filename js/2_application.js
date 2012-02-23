App = {
    start: function(){
        //inicializo el view para el search
        new App.PersonRouter();
        
    }
    /*
    displayAlert: function(message, type){
    	mensaje = new App.Alert({text : message});
		alerta = new App.AlertBoxView({model: mensaje});
		alerta.render();
    }
    */
};

App.Person = Backbone.Model.extend({
    defaults: {
        "firstName": '',
        "lastName": ''
    },
    url: function(){
        return this.id ? '/2.persons.php/' + this.id : '/2.persons.php';
    }
});

App.PersonCollection = Backbone.Collection.extend({
    model: App.Person,
    url: function(){
        return '/2.persons.php';
    }
});

App.PersonList = new App.PersonCollection();

App.PersonRouter = Backbone.Router.extend({
    initialize: function(){
        new App.PersonFormView({ router: this });
        new App.PersonListView();
        
        //update the collection on init - will trigger a reset event
        App.PersonList.fetch();
    }
});

App.Alert = Backbone.Model.extend({
	defaults:{ text: '' , type: 'message'}
});


App.AlertBoxView = Backbone.View.extend({
	initialize: function(){
		this.template = _.template($("#alertBox").html());
	},
    render: function(){
    	var html = this.template({ model: this.model.toJSON() });
    	console.log(html);
        this.el = html;
    }
})



App.PersonFormView = Backbone.View.extend({
    el: '#formPersona',
    events:{
        'click button.saveRecord': 'handleSubmit'
    },
    initialize: function(){
        this.router = this.options.router;  //options tienen todo lo que se le pasa por parametro
        //$(this.el).focus();
        this.$('#first_name').focus();
    },
    handleSubmit: function(){
        var Person = new App.Person();

        Person.set({firstName: this.$('#first_name').val(), lastName: this.$('#last_name').val() });
        Person.save();
        App.PersonList.add(Person);
        this.$('input').val('');
        this.$('#first_name').focus();  
    }
})

//Un registro de la lista
App.PersonListRecordView = Backbone.View.extend({
    tagName: 'li',
    
    initialize: function(){
        this.template = _.template($("#personListRecord").html());
        this.render();
        
        //when destroying a model, update the view
        this.model.bind('destroy', this.remove, this);
    },
    
    events: {
        'click span.remove' : 'clear',
        'click span.edit'   : 'editRecord'
    },

    //removes the view
    remove: function(){
        $(this.el).remove();
        console.log('Remove record view');
    },
    
    //distroys the model
    clear: function(){
        this.model.destroy();
        console.log('Destroy record');

    },
    
    editRecord: function(){
        console.log('edit Record');
    },
    
    render: function(){
        var html = this.template({ model: this.model.toJSON() });
        $(this.el).append(html);
    }
})

App.PersonListView = Backbone.View.extend({
    el: '#person-list',
    initialize: function(){
        App.PersonList.bind('add', this.renderOneItem, this);
        App.PersonList.bind('reset', this.renderAllItems, this);
    },
    renderOneItem: function(model){
        $(this.el).show()
        var view = new App.PersonListRecordView({ model : model })
        this.$('ul').append(view.el)
    },
    
    renderAllItems: function(){
        App.PersonList.each(this.renderOneItem);
    }
})