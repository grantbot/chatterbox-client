$(document).ready(function() {


  var response;
  var $newMessage;
  var escapedMessage;
  var rooms = {};

  function getDisplayMessages() {
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      data: {
        format:'json',
        order: '-createdAt'
      },
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        response = data.results;
        displayMessages(response);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });
    return response;
  }

  function displayMessages(messageArray) {
    for (var i=0; i<messageArray.length; i++) {
      rooms[messageArray[i].roomname] = true;


      $newMessage = $('<li></li>');
      escapedMessage = escapeHTML(messageArray[i].username + ' says: ' +
        messageArray[i].text);
      $newMessage.html(escapedMessage);
      $('.messages').append($newMessage);
    }
    console.log(rooms);
  }

  function refreshMessages() {
    clearMessages();
    getDisplayMessages();
  }

  function clearMessages() {
    $('.messages').html('')
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function postNewMessage (message) {
    var postObject = {
      roomname: "8th floor",
      text: message,
      username: window.location.search.replace(/\?username=/, '')
    };

    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(postObject),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    });

  };

  $('.input').on('keypress', function (event) {
    if (event.which === 13) {
      if ($('.input').val() !== '') {
        postNewMessage($('.input').val());
        $('.input').val('');
      }
    }
  });

  $('.postButton').on('click', function (event) {
      if ($('.input').val() !== '') {
        postNewMessage($('.input').val());
        $('.input').val('');
      }
  });


getDisplayMessages();
setInterval(refreshMessages, 10000);


});

// - gary says: "hello"

// createdAt: "2013-10-07T16:22:03.280Z"
// objectId: "teDOY3Rnpe"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T16:22:03.280Z"
// username: "gary"
