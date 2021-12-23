module.exports=(message,args,serverQueue)=>{

  if(!message.member.voice.channel) return message.channel.send("You needmto be in voice channel to use music commands");

  if(!serverQueue) return message.channel.send("There is nothing playing")

  if(!args[0]) return message.channel.send(`Volume: ${serverQueue.volume}`)

  if(isNaN(args[0])) return message.channel.send("Please provide a valid amount to change the volume to.")

  serverQueue.volume=args[0];
  serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
  message.channel.send(`Changed volume to **${args[0]}**`)

  return;
}