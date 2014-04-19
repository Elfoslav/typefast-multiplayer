Meteor.methods({
  'getOnlineUsersCount': function() {
    return App.usersCount;
  },
  'getRoomId': function(subscriptionId) {
    return App.subscriptionGroup[subscriptionId];
  }
});