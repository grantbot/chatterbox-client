$(document).ready(function() {


  var response;
  var $newMessage;
  var escapedMessage;
  var escapedUser;
  var newRooms = {};
  var currentRooms = {};
  var currentIntervalId;
  var reloadInterval = 8000;
  var friends = [];

  function getDisplayMessages(roomName) {
    roomName === "ALL CHATS" ? roomName = undefined : roomName = roomName;
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      data: {
        format:'json',
        order: '-createdAt',
        where: {"roomname": roomName}
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
    clearMessages();
    for (var i=0; i<messageArray.length; i++) {
      newRooms[escapeHTML(messageArray[i].roomname)] = true;
      escapedUser = escapeHTML(messageArray[i].username);
      $newMessage = $('<li class=' + escapedUser + '></li>');
      escapedMessage = '<user>' + escapedUser +
        '</user>' + ': ' + escapeHTML(messageArray[i].text)
      $newMessage.html(escapedMessage);
      $('.messages').append($newMessage);
    }
    for (var j=0; j<friends.length; j++) {
      $('.' + friends[j]).css("font-weight", "bold")
    }

    for (var room in newRooms) {
      if(!(room in currentRooms) && !(/=/.test(room))){
        $newRoom = $('<button class="roomButton"></button>');
        $newRoom.html(room);
        $newRoomOption = $('<option class="roomOption"></option>');
        $newRoomOption.text(room);
        $('.roomNav').append($newRoom);
        $('.roomSelect').append($newRoomOption);
        currentRooms[room] = true;
      }
    }
  }

  function refreshMessages(roomName) {
    getDisplayMessages(roomName);
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
      roomname: $( ".roomSelect option:selected" ).text(),
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

  $('.roomNav').on('click', '.roomButton', function (event) {
      clearInterval(currentIntervalId);
      var thisRoom = $(this).text();
      refreshMessages(thisRoom);
      currentIntervalId = setInterval(function() { refreshMessages(thisRoom) }, reloadInterval);
  });

  $('.messages').on('click', 'li user', function (event) {
      friendClass = $(this).text()
      if (friends.indexOf($(this).text()) === -1) {
        friends.push($(this).text());
      }
      $('.' + friendClass).css("font-weight", "bold")

  });

getDisplayMessages();
currentIntervalId = setInterval(refreshMessages, reloadInterval);


});

// - gary says: "hello"

// createdAt: "2013-10-07T16:22:03.280Z"
// objectId: "teDOY3Rnpe"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T16:22:03.280Z"
// username: "gary"
