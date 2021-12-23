const Discord= require('discord.js');
const fetch=require('node-fetch');

module.exports=async(message)=>{
  const embbededMessage= (msg)=>new Discord.MessageEmbed()
    .setTitle('Here\'s a joke for you')
    .setDescription(msg)
    .setTimestamp()

  const options={
	"method": "GET",
	"headers": {
		"x-rapidapi-key": process.env.JOKE_API_KEY,
		"x-rapidapi-host": "joke3.p.rapidapi.com"
    }
  }

  fetch("https://joke3.p.rapidapi.com/v1/joke",options)
    .then(res=>res.json())
    .then(data=>message.channel.send(embbededMessage(data.content)))
    .catch(err=>message.channel.send(`Error getting joke. try some other time.\n ${err}`));

}