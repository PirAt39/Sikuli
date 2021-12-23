module.exports=(client,message,serverQueue)=>{
  if(!message.member.voice.channel) return message.channel.sent("You need to be in voice channel to pause a song.");

  if(!serverQueue) return message.channel.sent("Queue is empty")

  if(serverQueue.playing) return message.channel.send("The music is already playing");

  serverQueue.playing=true;
  serverQueue.connection.dispatcher.resume();
  message.channel.send("Playing");
  client.user.setActivity(' | -help',{type:'PLAYING'})
  return;
}