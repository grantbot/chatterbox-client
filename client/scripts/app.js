
var response;

function getMessages() {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    data: {
      format:'json'
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
    var $newMessage = $('<li></li>');
    $newMessage.html(messageArray[i].username + ' says: ' +
      messageArray[i].text);
    $('.messages').append($newMessage);
  }
}

function refreshMessages() {
  clearMessages();
  var newMessages = getMessages();
  displayMessages(newMessages);
}

function clearMessages() {
  $('.messages').html('')
}

// - gary says: "hello"

// createdAt: "2013-10-07T16:22:03.280Z"
// objectId: "teDOY3Rnpe"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T16:22:03.280Z"
// username: "gary"
