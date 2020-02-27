const mongoose = require("mongoose");

const wikiSchema = mongoose.Schema({
    _id: String,
    title:{
      type: String,
      required: true
    } ,
    content: String,
    comment: String
  });

const Wiki = mongoose.model("article", wikiSchema);
const Instructions = mongoose.model("instruction", wikiSchema);

////////Default articles for the Wiki API--->

  const dPost1 = new Wiki({
    title: "Mongo DB",
    content: "Is a NoSQL database used mostly for non-relational storing purposes."
  });
  
  const dPost2 = new Wiki({
    title: "REST",
    content: "REST is short for representational state transfer. It's an architectural style for designing APIs"
  });
  
  const dPost3 = new Wiki({
    title: "API",
    content: "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
  });
  
  const dPost4 = new Wiki({
    title: "Bootstrap",
    content: "This is a framework developed by Twitter that contains pre-made front-end templates for web design."
  });
  
  const dPost5 = new Wiki({
    title: "DOM",
    content: "The Document Object Model is like an API for interacting with our HTML."
  });
  
  const dPost6 = new Wiki({
    title: "Chuck Norris",
    content: "Chuck Norris has a diary. It's called the Guinness Book of World Records."
  });
  
  const dPost7 = new Wiki({
    title: "Jack Bauer",
    content: "Jack Bauer once stepped into quicksand. The quicksand couldn't escape and nearly drowned."
  });
  

  ////////////Instructions on how to use the wiki API --->
  const instr1 = new Instructions({
    _id: 1,
    title: "The'/articles' Route",
    content: "Supports GET, POST & DELETE actions. To get all articles, post a new one or delete all articles",
    comment: "The POST action takes a 'title' and 'content' key to create a new article."
  });
  
  const instr2 = new Instructions({
    _id: 2,
    title: "The '/articles/insertArticleName' Route",
    content: "Supports GET, PUT, PATCH & DELETE actions. To respectively get the specified article, completely replace it, "+
    "edit a specific part of it or to delete said article.",
    comment: "The PUT & PATCH actions take a 'title' and 'content' key to either replace an article or edit a specific part of it."
  });
  
  const instr3 = new Instructions({
    _id: 3,
    title: "The '/articles-default' Route",
    content: "Supports a GET action. In case of the complete deletion of all articles, use this route to refill the database with the default ones."
  });
  
  const instr4 = new Instructions({
    _id: 4,
    title: "The Home Route AKA '/' ",
    content: "Supports a GET & POST action. Use this route to view the instructions for this API.",
    comment: "TODO: The POST action is to be reserved for admin privileges only. This feature will be added later."
  });
  
  const instr5 = new Instructions({
    _id: 5,
    title: "TODO",
    content: " 1- Add login for admin privileges. 2- Add an html file to facilitate POST, PUT, PATCH and DELETE actions.",
    comment: "While item 2 has not yet been implemented, feel free to use the application Postman to play with the API."
  });
  
  const instr6 = new Instructions({
    _id: 6,
    title: "Postman Download Link",
    content: "In case you wish to download Postman, use this link - https://www.getpostman.com/downloads/ "
  });
  
  const instr7 = new Instructions({
    _id: 7,
    title: "Postman Guide",
    content: "If you need a guide on how to use Postman, use this link - " +
    "https://dotnettutorials.net/lesson/how-to-use-postman-to-test-web-api/",
    comment: "Because 'Why not?' "
  });

  const dPosts = [dPost1, dPost2, dPost3, dPost4, dPost5, dPost6, dPost7];
  const instructionArticles = [instr1, instr2, instr3, instr4, instr5, instr6, instr7];
  
  
  exports.dPosts = dPosts;
  exports.instructionArticles= instructionArticles;
  exports.Wiki = Wiki;
  exports.Instructions = Instructions;

  