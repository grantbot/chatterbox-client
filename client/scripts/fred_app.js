var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox/'
});

var Messages = Backbone.Collection.extend({

  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox/',

  loadMsgs: function(){
    this.fetch({data: { order: '-createdAt' }});
  },

  parse: function(response, options){
    var results = [];
    for( var i = response.results.length-1; i >= 0; i-- ){
      results.push(response.results[i]);
    }
    return results;
  }

});

var FormView = Backbone.View.extend({

  template: _.template('<h1>chatter<em>box</em></h1> \
      <!-- Your HTML goes here! --> \
      <div class="spinner"><img src="images/spiffygif_46x46.gif"></div> \
      <form action="#" id="send" method="post"> \
        <input type="text" name="message" id="message"/> \
        <input type="submit" name="submit" class="submit"/> \
      </form>'),

  events: {
    'submit form': 'handleSubmit'
  },

  initialize: function(){
    this.collection.on( 'sync', this.stopSpinner, this );
  },

  render: function(){
    this.$el.html(this.template());
    return this.$el;
  },

  handleSubmit: function(e){
    e.preventDefault();

    var $text = this.$('#message');

    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val()
    });

    $text.val('');
  },

  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function(){
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});

var MessagesView = Backbone.View.extend({

  initialize: function(){
    this.collection.on( 'sync', this.render, this );
    this.onscreenMessages = {};
    this.blockedUsers = ['BRETTSPENCER', 'Chuck Norris'];
  },

  render: function(){
    this.collection.forEach(this.renderMessage, this);
    return this.$el;
  },

  renderMessage: function(message){
    if( this.blockedUsers.indexOf(message.get('username')) < 0 ){
      if( !this.onscreenMessages[message.get('objectId')] ){
        var messageView = new MessageView({model: message});
        this.$el.prepend(messageView.render());
        this.onscreenMessages[message.get('objectId')] = true;
      }
    }
  }

});

var MessageView = Backbone.View.extend({

  template: _.template('<div class="chat" data-id="<%= objectId %>"><div class="user"><%= username %></div><div class="text"><%- text %></div></div>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});
