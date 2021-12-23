const Discord= require('discord.js');

module.exports=(client, message)=>{
  const voiceData=[
    {
      name: "play",
      value: "play any songs from youtube \n -play <song_name>"},
    {
      name: "pause",
      value: "pause the song that is being played \n -pause"},
    {
      name:"queue",
      value: "prints the songs in the queue \n -queue"},
    {
      name:"resume",
      value: "resumes the song which is has been paused \n -resume"},
    {
      name:"stop",
      value: "stops the song being played \n -stop"},
    {
      name:"skip",
      value: "skip the current song play next song from the queue \n -skip"},
    {
      name:"volume",
      value: "changes the volume to the given value\n -volume <number>"}
  ]
  const moderationData=[
    {
      name:"kick",
      value: "kicks the member. If you do not have permission, it reacts to your message and awaits for the reaction of a member who has the permission\n -kick @user reason(optional)"},
    {
      name:"ban",
      value: "bans the member if you have permission\n -ban @user reason(optional)"},
    {
      name:"clear",
      value: "deletes given number of messages. Messages which were sent before 2 weeks cannot be deleted. This is to do with Discord policy\n -clear <number greater than 1 and less than 100>"}
  ]
  const funData={
    name:"joke",
    value: "sends a random joke\n -joke"
  }

  const voiceEmbed={
    color:0x0099ff,
    title:'Music Commands',
    fields:voiceData
  }
  const modEmbed={
    color:"#6200ff",
    title:'Moderation Commands',
    fields:moderationData
  }
  const funEmbed={
    color:"#f55b2c",
    title:'Fun Commands',
    fields:funData
  }

  message.channel.send({embed: voiceEmbed})
  message.channel.send({embed: modEmbed})
  // message.channel.send({embed: funEmbed})


}
