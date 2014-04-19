var uuid = Meteor.uuid();
console.log('logging with id:', uuid);
var roomId;

textStream.emit('join', uuid);

sendText = function(text, roomId) {
  textStream.emit('text', { text: text, roomId: roomId });
  console.log('me: ' + text);
};

textStream.on('text', function(text) {
  console.log('user: ' + text + ', by ' + this.subscriptionId);
});

//emited from server from join
textStream.on('afterJoin' + uuid, function(data) {
  roomId = data.roomId;
  
  textStream.on('exitRoom' + roomId, function() {
    console.log('user leaved this room');
  });
  
  textStream.on('start' + roomId, function() {
    console.log('start game...: ');
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