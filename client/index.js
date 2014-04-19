Client.uuid = Meteor.uuid();
console.log('logging with id:', Client.uuid);
var roomId;

textStream.emit('join', Client.uuid);

//emited from server from join
textStream.on('afterJoin' + Client.uuid, function(data) {
  roomId = data.roomId;
  
  textStream.on('exitRoom' + roomId, function() {
    Session.set('ready', false);
    console.log('user leaved this room');
  });
  
  textStream.on('start' + roomId, function() {
    Session.set('ready', true);
    console.log('start game...: ');
  });
  
  textStream.on('updateCompetitorText' + roomId, function(data) {
    if(data.uuid != Client.uuid) {
      //update only competitor's text not mine
      $('.competitor').text(data.text);
    }
  });
  
  console.log('subId', this.subscriptionId);
  console.log('afterJoin data:', data);
});

textStream.on('updateRoomId', function(serverRoomId) {
  roomId = serverRoomId;
  console.log('roomId: ', roomId);
});

textStream.on('updateUsersCount', function(count) {
  console.log('updateuserscount:', count);
  Session.set('usersCount', count);
});