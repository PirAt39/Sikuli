module.exports=(client,message,serverQueue)=>{
  if(!message.member.voice.channel) return message.channel.sent("You need to be in voice channel to pause a song.");

  if(!serverQueue) return message.channel.sent("Nothing Playing")

  if(!serverQueue.playing) return message.channel.send("The music is already paused");

  serverQueue.playing=false;
  serverQueue.connection.dispatcher.pause();
  message.channel.send("Paused!");
  client.user.setActivity(' | -help',{type:'WATCHING'})
  return;
}