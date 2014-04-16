sendText = function(text) {
  textStream.emit('text', text);
  console.log('me: ' + text);
};

textStream.on('text', function(text) {
  console.log('user: ' + text + ', by ' + this.subscriptionId);
});