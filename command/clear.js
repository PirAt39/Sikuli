const Discord= require('discord.js');

module.exports=async(client,args,message)=>{
  if(!args.length){
    message.reply("Please enter number of messages you want to delete.");
    return;
  }

  if(args[0]>100 || args[0]<0){
    message.reply("number should be between 1 and 100");
    return;
  }

  const embeddedMessage=(number)=>new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`Deleted ${number} messages`)
          .setTimestamp()

  if(message.member.hasPermission(['MANAGE_MESSAGES'])){
    try{
      let deletedMessages =await message.channel.bulkDelete(args[0],true)
      let sentMessage=await  message.channel.send(embeddedMessage(deletedMessages.size))
      sentMessage.delete({timeout:5000})
    }catch(err){
      console.log(err);
    }
  }else{
    message.reply("You don\'t have required permission.")
    return;
  }
}