const Discord= require('discord.js');

module.exports = async (client,args,message,users)=>{
  // console.log(args)
  if(!args.length){
    message.channel.send("Please enter a valid command. \n \'-kick @user reason(optional)\'")
    return;
  }
  
  const mentionedMember=message.mentions.members.first();
  if(!mentionedMember){
    message.reply("Please enter a valid command. \n \'-kick @user reason(optional)\'")
    return;
  }
  // if(mentionedMember.hasPermission('ADMINISTRATOR')){
  //   message.channel.send(`I do not have permission to kick ${mentionedMember}`)
  //   return undefined;
  // }
  
  let reason= args.slice(2).join(' ');
  
  if(!reason) reason="No reason given";
  
  const kickEmbeded=new Discord.MessageEmbed()
    .setTitle(`you were kicked from ${message.guild.name}`)
    .setDescription(`Reason: ${reason}`)
    .setColor("#5708ab")
    .setTimestamp()
    .setFooter(client.user.tag, client.user.displayAvatarURL());
  
  if(message.member.hasPermission('KICK_MEMBERS')){    
    try{
      await mentionedMember.kick(reason);
      await message.channel.send(new Discord.MessageEmbed()
                          .setTitle(`${mentionedMember.user.username} was kicked by ${message.guild.name}`)
                          .setDescription(`Reason: ${reason}`)
                          .setColor("#5708ab")
                          .setTimestamp());
                          
      delete users[mentionedMember];
    }catch(err){
      console.log(err);
      message.channel.send(`Cannot kick ${mentionedMember}\n ${err}`)
    }
    try{
      await mentionedMember.send(kickEmbeded);
    } catch(err){
      console.log(err);
    }
  }else{
    await message.react('👍');
    const filter=(reaction,user)=>{
      return !user.bot && user.id !== message.author.id && reaction.emoji.name === '👍'}

    const collector=message.createReactionCollector(filter,{time:30000});

    collector.on('collect',async (reaction,user)=>{
      message.guild.members.fetch(`${user.id}`)
        .then(async user=>{
          if(user.hasPermission('KICK_MEMBER')){
            try{
              await mentionedMember.kick(reason);
              message.channel.send(new Discord.MessageEmbed()
                            .setTitle(`${mentionedMember.user.username} was kicked by ${message.guild.name}`)
                            .setDescription(`Reason: ${reason}`)
                            .setColor("#5708ab")
                            .setTimestamp());
                            
              delete users[mentionedMember];
            }catch(err) {console.log(err);}
          }
        }).catch(err=>{
          console.log(err);
        })
    })
  
    collector.on('end', collected => {
      console.log(`Collected ${collected.size} items`);
    });
  }
}