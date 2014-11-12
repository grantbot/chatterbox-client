
function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',

  initialize: function (argument) {

  }


});


var MessageCollection = Backbone.Collection.extend({
   url: 'https://api.parse.com/1/classes/chatterbox',
   model: Message,

   loadMsgs: function(roomName) {
    this.fetch({data: { order: '-createdAt' }, where: {"roomname": roomName} })
   },

   parse: function(response) {
    var result = [];
    for (var i = response.results.length; i >= 0; i --) {
      result.push(response.results[i]);
    }

    return result;
   },


});


var MessageView = Backbone.View.extend({

  render: function() {
  var userName = escapeHTML(this.model.attributes.username);
  var userText = escapeHTML(this.model.attributes.text);

  this.$el.html( '<li class="' + userName + '">'+ userName + ': ' + userText +'</li>');

  return this.$el.html();
}

});

var MessageCollectionView = Backbone.View.extend({

  initialize: function() {
    console.log(this.collection);
    this.model.on('sync', this.render, this);
    this.onScreenMessages = {};
  },

  render: function() {
    this.model.forEach(this.renderMessage, this);
    $('.messages').append(this.$el.html());
  },

  renderMessage: function(message) {
    if (!this.onScreenMessages[message.get('objectId')]) {
      var messageView = new MessageView({model: message});
      this.$el.prepend(messageView.render());
      this.onScreenMessages[message.get('objectId')] = true;
      console.log("onscreenMess:", this.onScreenMessages);
      console.log("objectID", message.get('objectId'));
      debugger;
    }

  }

});

// collection = new MessageCollection();
// collectionView = new MessageCollectionView({model: collection});



