App = {
    start: function(){
        //inicializo el view para el search
        new App.PersonRouter();
        
    }
};

//Extend model to have a defaultErrorHandler
Model = Backbone.Model.extend({
	initialize: function(attributes, options) {
		options || (options = {});
    	_.bindAll(this, 'defaultErrorHandler');
    	this.bind("error", this.defaultErrorHandler);
    	this.init && this.init(attributes, options);
  	},
	defaultErrorHandler: function(model, error) {
    	var errors;
    	if (_.isArray(error)) {
      		//errors = error.join('<br/>');
		    _.each(error,function(un_error){
        		Alert = new App.Alert({text: un_error});
	      		App.AlertList.add(Alert);
      		});
    	} else {
      		// Server error; parse as needed into a displayable error.
      		Alert = new App.Alert({text: error});
	      		App.AlertList.add(Alert);
		}
	}
});

App.Person = Model.extend({
	validate: function(attrs) {
//		console.log(attrs)
		var errors = []	
    	if (_.isEmpty(attrs.firstName)) {
    		errors.push("First Name can't be blank");
    	}
    	if (_.isEmpty(attrs.lastName)) {
    		errors.push("Last Name can't be blank");
    	}
		if(_.size(errors) > 0) {
			return errors
		}
  	},
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
        new App.AlertListView();
        //update the collection on init - will trigger a reset event
        App.PersonList.fetch();
    }
});


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
        Person.save({
        	firstName: this.$('#first_name').val(), 
        	lastName: this.$('#last_name').val()
        },{success: function(){
			App.PersonList.add(Person);
	        this.$('input').val('');
        }});

	   

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
        //$('ul', this.el).append(view.el)
        this.$('ul').append(view.el)
    },
    
    renderAllItems: function(){
        App.PersonList.each(this.renderOneItem, this);
    }
})


//---- Alerts

App.Alert = Backbone.Model.extend({
	defaults:{ text: '' , type: 'message'}
});

App.AlertCollection = Backbone.Collection.extend({
	model: App.Alert
})

App.AlertList = new App.AlertCollection();

App.AlertView = Backbone.View.extend({
	tagName: 'li',
	initialize: function(){
		this.template = _.template($("#alertBox").html());
		this.render();
		this.model.bind('destroy', this.remove, this);
	},
	events: {
		'click .close': 'closeAlert'
	},
    render: function(){
    	var html = this.template({ model: this.model.toJSON() });
        $(this.el).append(html);
    },
    closeAlert: function(){
		this.model.destroy();
        console.log('Destroy Alert');
    },
    remove: function(){
    	$(this.el).remove();
        console.log('Remove alert view');
    }
})

App.AlertListView = Backbone.View.extend({
	el: '#alert-list',
	initialize: function(){
		App.AlertList.bind('add', this.renderOneItem, this);
	},
	
	renderOneItem: function(model){
		$(this.el).show()
        var view = new App.AlertView({ model : model })
        this.$('ul').append(view.el)
        
	}
})

