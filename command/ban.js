const Discord= require('discord.js');

module.exports=async(client,message,args)=>{
  if(!args.length){
    message.channel.send("Please enter a valid command. \n \'-ban @user reason(optional)\'")
    return;
  }

  const mentionedMember=message.mentions.members.first();
  if(!mentionedMember){
    message.reply("Please enter a valid command. \n \'-ban @user reason(optional)\'")
    return;
  }

  let reason= args.slice(2).join(' ');
  if(!reason) reason="No reason given";

  const banEmbeded=new Discord.MessageEmbed()
    .setTitle(`you were banned from ${message.guild.name}`)
    .setDescription(`Reason: ${reason}`)
    .setColor("#5708ab")
    .setTimestamp()
    .setFooter(client.user.tag, client.user.displayAvatarURL())

  if(message.member.hasPermission('BAN_MEMBERS')){    
    try{
      await mentionedMember.ban({reason});
      await message.channel.send(new Discord.MessageEmbed()
                          .setTitle(`${mentionedMember.user.username} was banned by ${message.guild.name}`)
                          .setDescription(`Reason: ${reason}`)
                          .setColor("#5708ab")
                          .setTimestamp());
                          
    }catch(err){
      console.log(err);
      message.channel.send(`Cannot ban ${mentionedMember}\n ${err}`)
    }
    try{
      await mentionedMember.send(banEmbeded);
    } catch(err){
      console.log(err);
    }
  } else{
    return message.reply(`You don\'t have enough permission to ban ${mentionedMember}.`)
  }
}