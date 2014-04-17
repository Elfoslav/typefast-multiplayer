Meteor.methods({
  'getOnlineUsersCount': function() {
    return App.usersCount;
  }
});