const Discord= require("discord.js")
const fetch = require("node-fetch");
const ytdl = require('ytdl-core');

module.exports=async (client,args,message,queue)=>{

  const voiceChannel=message.member.voice.channel;
  if(!args.length){
    message.channel.send("Please enter a valid command. \n \'-play song\'")
    return;
  }
  if(!voiceChannel){
    message.channel.send("you need to be in a voice channel to play a song");
    return;
  }

  const permissions=voiceChannel.permissionsFor(message.client.user);
  if(!permissions.has('CONNECT')) return message.channel.send("I do not have permission to join the voice channel");
  if(!permissions.has('SPEAK')) return message.channel.send("I do not have permission to speak in the voice channel");

  const query=args.join(' ');
  const song={
    title: '',
    url: ''
  }
  let videoId;

  if(ytdl.validateURL(query)){
    const info=await ytdl.getInfo(query);
    videoId=info.videoDetails.videoId;
    song.url=info.videoDetails.video_url;
    song.title=info.videoDetails.title;
  } else{
    try{
      const res=await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&key=${process.env.API_KEY}`)
      const data=await res.json();
      videoId=data.items[0].id.videoId;
      song.title=data.items[0].snippet.title;
      song.url=`https://www.youtube.com/watch?v=${videoId}`;
    }catch(err){
      message.reply(`Please provide correct argument. ${err}`);
    }
  }

  const serverQueue=queue.get(message.guild.id);
  if(!serverQueue){
    const queueConstruct={
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs:[],
      volume:5,
      playing: true 
    }
    queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try{
      voiceChannel.join()
        .then(connection=>queueConstruct.connection=connection)
        .then(r=>play(message.guild,queueConstruct.songs[0]))
        .then(client.user.setActivity(' | -help',{type:'PLAYING'}))
    }catch(err){
      queue.delete(message.guild.id)
      console.log(`There was error joining the voice channel: ${err}`);
      return message.channel.send(`There was an error connecting the Voice Channel ${err}`);
    }
  } else{
    serverQueue.songs.push(song);
    return message.channel.send(`**${song.title}** has been added to the queue`);
  }
  return undefined;

  function play(guild,song){
    const serverQueue=queue.get(message.guild.id);
    if(!song){
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id)
      return undefined;
    }
    // console.log(serverQueue)
    const dispatcher=serverQueue.connection.play(ytdl(song.url))
      .on('start',()=>{
        return message.channel.send(`Playing **${song.title}** now.`)
      })
      .on('finish',()=>{
        serverQueue.songs.shift()
        play(guild,serverQueue.songs[0])
      })
      .on('error',err=>console.log(err));
  
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  }
}