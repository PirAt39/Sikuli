const Discord= require("discord.js");
const dotenv=require('dotenv');
const Perspective = require('./perspective.js');
const Play=require('./command/play');
const Kick=require('./command/kick');
const Ban=require('./command/ban');
const Clear=require('./command/clear');
const Stop=require('./command/stop');
const Skip= require('./command/skip');
const Volume=require('./command/volume');
const Queue=require('./command/queue');
const Pause=require('./command/pause');
const Resume= require('./command/resume');
const Joke=require('./command/joke')
const Help=require('./command/help')

const client=new Discord.Client();
dotenv.config();


const emojiMap = {
  'FLIRTATION': '💋',
  'TOXICITY': '🧨',
  'INSULT': '👊',
  'INCOHERENT': '🤪',
  'SPAM': '🐟',
};

const queue=new Map();
const users={};
const PREFIX=process.env.PREFIX;

async function kickBaddie(user,guild){
  const member=guild.member(user);
  if(!member) return;

  try{
    await member.kick(`${user.username} was kicked!`);
    return true;
  } catch(err){
    console.log(`could not kick user ${user.username}: ${err}`);
    return false;
  }
}

async function evaluateMessage(msg,type){
  if(!msg.content) return;
  let scores;
  try{
    scores=await Perspective.analyzeText(msg.content);
  } catch(err){
    console.log(err);
    return false;
  }
  const userId=msg.author.id;

  for(const attribute in emojiMap){
    if(scores[attribute]){
      if(attribute!=='INCOHERENT'){
        msg.react(emojiMap[attribute]);
        users[userId][attribute]=users[userId][attribute] ? users[userId][attribute]+1 : 1;
      }
    }
  }
  if (type==='KICK'){
    return (users[userId]['TOXICITY']>process.env.KICK_THRESHOLD);
  } if(type==='WARN'){
    return (users[userId]['TOXICITY']>process.env.WARN_THRESHOLD);
  }
}

function getKarma() {
  const scores = [];
  for (const user in users) {
    if (!Object.keys(users[user]).length) continue;
    let score = `<@${user}> - `;
    for (const attr in users[user]) {
      score += `${emojiMap[attr]} : ${users[user][attr]}\t`;
    }
    scores.push(score);
  }
  console.log(scores);
  if (!scores.length) {
    return '';
  }
  return scores.join('\n');
}


client.on('ready', () => {
  console.log('I am ready!');
  client.user.setActivity(' | -help',{type:'WATCHING'})
});

client.on('message', async (message) => {

  if (!message.guild || message.author.bot) return;

  const userid = message.author.id;
  if (!users[userid]) {
    users[userid] = [];
  }

  let shouldKick = false;
  try {
    shouldKick = await evaluateMessage(message,'KICK');
  } catch (err) {
    console.log(err);
  }
  if (shouldKick) {
    let kicked= await kickBaddie(message.author, message.guild);
    if(kicked){    
      message.channel.send(`kicked user ${message.author.username} from server`);
    } else{
      message.channel.send(`cannot kick ${message.author.username}, Missing Permissions`);
    }
    delete users[message.author.id];
    return;
  }

  let shouldWarn = false;
  try {
    shouldWarn = await evaluateMessage(message,'WARN');
  } catch (err) {
    console.log(err);
  }
  if (shouldWarn) {
    message.reply(`Warning ${message.author.username}`)
    return;
  }
  const args=message.content.split(' ').filter(e => String(e).trim()).slice(1);
  const guildId=message.guild.id;


  if (message.content.startsWith(`${PREFIX}karma`)) {
    const karma = getKarma(message);
    message.channel.send(karma ? karma : 'No karma yet!');
  }
  if (message.content.startsWith(`${PREFIX}kick`)){
    Kick(client,args,message,users);
  }
  if(message.content.startsWith(`${PREFIX}ban`)){
    Ban(client,message,args);
  }
  if (message.content.startsWith(`${PREFIX}clear`)){
    Clear(client,args,message);
  }
  if (message.content.startsWith(`${PREFIX}play`)){
    Play(client,args,message,queue);
  }
  if(message.content.startsWith(`${PREFIX}stop`)){
    Stop(client,message,queue.get(guildId));
  }
  if(message.content.startsWith(`${PREFIX}skip`)){
    Skip(message,queue.get(guildId));
  }
  if(message.content.startsWith(`${PREFIX}volume`)){
    Volume(message,args,queue.get(guildId));
  }
  if(message.content.startsWith(`${PREFIX}queue`)){
    Queue(message,queue.get(guildId))
  }
  if(message.content.startsWith(`${PREFIX}pause`)){
    Pause(client,message,queue.get(guildId));
  }
  if(message.content.startsWith(`${PREFIX}resume`)){
    Resume(client,message,queue.get(guildId));
  }
  // if(message.content.startsWith(`${PREFIX}joke`)){
  //   Joke(message);
  // }
  if(message.content.startsWith(`${PREFIX}help`)){
    Help(client, message);
  }
});

client.login(process.env.DISCORD_TOKEN);