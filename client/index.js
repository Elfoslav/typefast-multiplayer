textStream.emit('join');

sendText = function(text) {
  textStream.emit('text', text);
  console.log('me: ' + text);
};

textStream.on('text', function(text) {
  console.log('user: ' + text + ', by ' + this.subscriptionId);
});

textStream.on('updateUsersCount', function(count) {
  console.log('updateuserscount', count);
  Session.set('usersCount', count);
});