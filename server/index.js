Meteor.startup(function () {
  // code to run on server at startup
});

var clients = {};

textStream.on('join', function(uuid) {
  
  var subscriptionId = this.subscriptionId;
  App.usersCount++;
  var freeRoom = -1;
  //id of room where user is
  var roomId;
  
  for(var i = 0; i < App.rooms.length; i++) {
    //find free room
    if(App.rooms[i] && App.rooms[i].players.length < 2) {
      freeRoom = i;
      break;
    }
  }
  
  if(freeRoom === -1) {
    //there is no free room, create one
    var roomsCount = App.rooms.push({
      players: [subscriptionId]
    });
    //roomId is index of App.rooms
    roomId = roomsCount - 1;
  } else {
    roomId = freeRoom;
    //add player to a free room
    App.rooms[freeRoom].players.push(subscriptionId);
  }
  
  App.subscriptionGroup[subscriptionId] = roomId;
  clients[uuid] = uuid;
  
  console.log('uuid:', uuid);
  console.log('subscriptionId:', subscriptionId);
  console.log('roomId', roomId);
  console.log('rooms:', App.rooms);
  
  textStream.emit('updateUsersCount', App.usersCount);
  //emit after join so we can call updateRoomId from client
  textStream.emit('afterJoin' + uuid, { subscriptionId: subscriptionId, roomId: roomId });
  
  if(App.rooms[roomId].players.length == 2) {
    textStream.emit('start' + roomId);
  }
  
  this.onDisconnect = function() {
    App.usersCount--;
    var roomId;
    
    for(var i = 0; i < App.rooms.length; i++) {
      //find a room with given subscriptionId
      if(App.rooms[i]) {
        var subIndex = App.rooms[i].players.indexOf(subscriptionId);
        console.log('onDisconnect players subIndex:', subIndex);
        if(subIndex !== -1) {
          //delete player from room
          App.rooms[i].players.splice(subIndex, 1);
          if(App.rooms[i].players.length === 0) {
            //delete room when it's empty
            App.rooms.splice(i, 1);
          }
          
          delete App.subscriptionGroup[subscriptionId];
          delete clients[uuid];
          roomId = i;
          break;
        }
      }
    }
    
    console.log('App.rooms onDisconnect:', App.rooms);
    
    //Meteor.call('logoutUser');
    textStream.emit('updateUsersCount', App.usersCount, roomId);
    textStream.emit('exitRoom' + roomId, roomId);
    console.log('disconnected...', subscriptionId);
    console.log('disconnected usersCount...', App.usersCount);
  }
});

textStream.permissions.write(function(event) {
  return true;
});

textStream.permissions.read(function(event, data) {  
  return true;
});