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
      App.searchResults.add({term: term});
  }
}


//Rutas de la aplicación
App.SearchRouter = Backbone.Router.extend({
  initialize : function(){
      new App.SearchView({router: this});
      new App.SearchResultsView();
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
  e1:'#search-results',
  initialize: function(){
      //asignar el template usando underscore como sistema de templating
      //convierte this.template en una funcion this.template()
      this.template = _.template($("#imageTemplate").html());
      
      //cuando a la colección searchResults se le agrega un item, rendereamos
      //El tercer argumente le da contexto para el view
      
      App.searchResults.bind('add', this.renderItem, this);
  },
  renderItem: function(model){

      $(this.el).show();
      var html = this.template({model: model.toJSON()});
      
      //this.$('ul').append(html)
      
      $(".thumbnails").append(html);
      
  }
});

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