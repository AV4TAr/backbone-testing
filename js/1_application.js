App = {
    start: function(){
        //inicializo el view para el search
        new App.SearchRouter();
    }  
};


App.SearchResult = Backbone.Model.extend({})

//Coleccion de backbone
App.SearchResultList = Backbone.Collection.extend({
    //que contiene la coleccion -> modelo
    model: App.SearchResult 
})


App.searchResults = new App.SearchResultList();


App.SearchController = {
    search: function(term){
        //agrego el termino a lista de resultados
        App.searchResults.add({
            term: term
        });
    }
}


//Rutas de la aplicación
App.SearchRouter = Backbone.Router.extend({
    initialize : function(){
        new App.SearchView({ router: this });
        new App.SearchResultsView();
        new App.FavoritesView();
    },
  
    routes: {
        'search/:term' : 'search'
    },
  
    //la variable term viene definida por la ruta
    search: function(term){
        App.SearchController.search(term);
    }
})




App.SearchResultsView = Backbone.View.extend({
    el: '#search-results',

    initialize: function() {
        //cuando a la colección searchResults se le agrega un item, rendereamos
        //El tercer argumente le da contexto para el view
        App.searchResults.bind('add', this.renderItem, this)
    },

    renderItem: function(model) {
        $(this.el).show()

        var view = new App.SearchResultView({
            model : model
        })
        this.$('ul').append(view.el)
    }  
})


//Representa un element de la lista, la vamos a generar on the fly
App.SearchResultView = Backbone.View.extend({
    //va a genere un elemento il
    tagName: "li",
    
    events: {
        'click a' : 'addFavorite'
    },
  
    initialize: function(){
        //asignar el template usando underscore como sistema de templating
        //convierte this.template en una funcion this.template()
        this.template = _.template($("#imageTemplate").html());
        this.render();
    },
  
    render: function(){
        //el constructor del elemento toma el parametro model y lo asigna en this.model
        var html = this.template({
            model: this.model.toJSON()
            });
        $(this.el).append(html);
    },
    
    addFavorite: function(){  
        App.favorites.add(this.model);
    }
})


App.Favorite = Backbone.Model.extend({});
App.FavoriteList = Backbone.Collection.extend({
    model: App.Favorite
})
App.favorites = new App.FavoriteList();

App.FavoritesView = Backbone.View.extend({
    el: '#favorites',
    initialize: function(){
        App.favorites.bind('add', this.renderItem, this);
        App.favorites.bind('add', this.removeEmptyMessage, this);
    },
    
    renderItem: function(model){
        this.$('ul').show();
        var view = new App.FavoriteView({
            model: model
        });  
        this.$('ul').append(view.el)
    },
    
    removeEmptyMessage: function(){
        this.$('p').hide();
    }
})
 
App.FavoriteView = Backbone.View.extend({
    tagName: 'li',
    initialize: function(){
        this.template = _.template($('#imageTemplate').html());
        this.render();
    },
    
    render: function(){
        var html = this.template({
            model : this.model.toJSON()
            });
        $(this.el).append(html)
    }
})

// Declaracion del view para el search input
App.SearchView = Backbone.View.extend({
    el: '#search',
    events: {
        'keypress': 'handleEnter'    //bind event to keypress
    },
    initialize: function(){
        this.router = this.options.router;  //options tienen todo lo que se le pasa por parametro
        $(this.el).focus();
    },
  
    handleEnter: function(e){
        if(e.keyCode == 13){
            // el booleano que se le pasa por parametro ejecuta el evento al router
            // en caso de no pasarlo simplemente cambia la url 
            this.router.navigate('search/'+$(this.el).val() , true);
        }
    }
})