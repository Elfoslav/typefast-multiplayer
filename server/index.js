Meteor.startup(function () {
  // code to run on server at startup
});

textStream.on('join', function() {
  
  var subscriptionId = this.subscriptionId;
  App.usersCount++;
  
  console.log('joined: ', this.subscriptionId);
  
  textStream.emit('updateUsersCount', App.usersCount);
  
  this.onDisconnect = function() {
    App.usersCount--;
    textStream.emit('updateUsersCount', App.usersCount);
    console.log('disconnected...', subscriptionId);
  }
});