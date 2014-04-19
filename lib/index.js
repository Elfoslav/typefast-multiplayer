textStream = new Meteor.Stream('text');

App = {};
App.usersCount = 0;
App.rooms = [];
App.subscriptionGroup = {};