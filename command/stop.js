module.exports=async (client,message,serverQueue)=>{

  if(!message.member.voice.channel){
    return message.channel.send("You need to be in a voice channel to stop");
  }
  if(!serverQueue){
    return message.channel.send("There is nothing playing")
  }

  serverQueue.songs=[]
  serverQueue.connection.dispatcher.end();
  message.channel.send("Stopped")
  client.user.setActivity(' | -help',{type:'WATCHING'})
  return;
}