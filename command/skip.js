module.exports=(message,serverQueue)=>{
  if(!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to skip a song")

  if(!serverQueue) return message.channel.send("There is nothing playing")

  serverQueue.connection.dispatcher.end();
  message.channel.send("I have skipped the music for you")
  return;
}