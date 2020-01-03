//jshint esversion:6

    //Server SetUp --->
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const user = require(__dirname+"/user.js");
const favicon = require("serve-favicon");
const password = user.getPass();
const userName = user.getUsr();
let port = process.env.PORT;

if(port==null || port==""){
  port = 4000;
}
app.listen(port, function(){
  console.log("Server running on port: "+port);
});

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(__dirname + '/public/imgs/favicon.ico'));

//Database Configuration --->
const localUrl = "mongodb://localhost:27017/";
const remoteUrl = 'mongodb+srv://'+userName+':'+password+'@cluster0-llc1a.mongodb.net/';
const dbName = "wikiDB";

const localDbUrl = localUrl+dbName;
const remoteDbUrl =remoteUrl+dbName;

mongoose.connect(remoteDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect(localDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

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
const dPosts = [dPost1, dPost2, dPost3, dPost4, dPost5, dPost6, dPost7];


////////////Instructions on how to use the wiki API --->
const instr1 = new Instructions({
  _id: "1",
  title: "The'/articles' Route",
  content: "Supports GET, POST & DELETE actions. To get all articles, post a new one or delete all articles",
  comment: "The POST action takes a 'title' and 'content' key to create a new article."
});

const instr2 = new Instructions({
  _id: "2",
  title: "The '/articles/insertArticleName' Route",
  content: "Supports GET, PUT, PATCH & DELETE actions. To respectively get the specified article, completely replace it, "+
  "edit a specific part of it or to delete said article.",
  comment: "The PUT & PATCH actions take a 'title' and 'content' key to either replace an article or edit a specific part of it."
});

const instr3 = new Instructions({
  _id: "3",
  title: "The '/articles-default' Route",
  content: "Supports a GET action. In case of the complete deletion of all articles, use this route to refill the database with the default ones."
});

const instr4 = new Instructions({
  _id: "4",
  title: "The Home Route AKA '/' ",
  content: "Supports a GET & POST action. Use this route to view the instructions for this API.",
  comment: "TODO: The POST action is to be reserved for admin privileges only. This feature will be added later."
});

const instr5 = new Instructions({
  _id: "5",
  title: "TODO",
  content: " 1- Add login for admin privileges. 2- Add an html file to facilitate POST, PUT, PATCH and DELETE actions.",
  comment: "While item 2 has not yet been implemented, feel free to use the application Postman to play with the API."
});

const instr6 = new Instructions({
  _id: "6",
  title: "Postman Download Link",
  content: "In case you wish to download Postman, use this link - https://www.getpostman.com/downloads/ "
});

const instr7 = new Instructions({
  _id: "7",
  title: "Postman Guide",
  content: "If you need a guide on how to use Postman, use this link - " +
  "https://dotnettutorials.net/lesson/how-to-use-postman-to-test-web-api/",
  comment: "Because 'Why not?' "
});
const instructionArticles = [instr1, instr2, instr3, instr4, instr5, instr6, instr7];

//API code --->

///////////////////// Requests Targetting Instruction & Default Articles

app.route("/")

.get(function(req, res){
  Instructions.find({}, function(err, docsFound){
    if(!err){
      if(docsFound<1){
        Instructions.insertMany(instructionArticles, function(error){
          if(!err){
            console.log("Successfully added default instructions.");
            res.redirect("/");
          } else{
            res.send(error);
          }
        });
      }else{
        res.send(docsFound); //If there are documents on the Intructions db, render them.
      }

    } else{
      res.send(err);
    }

  });

})

.post(function(req, res){
  //console.log(req.body.title);
  //console.log(req.body.content);

  const newInstruction = new Instructions({
    title: req.body.title,
    content: req.body.content
  });

  newInstruction.save(function(err){
    if(!err){
      res.send("<h1>Successfully added new instruction.</h1>");
    } else{
      res.send(err);
    }
  });
});


app.get("/articles-default", function(req, res){ //route to insert default items

  Wiki.find({}, function(err, articlesFound){

    if(!err){

      if(articlesFound<1){
        Wiki.insertMany(dPosts, function(err){
          res.send("<h1> Successfully inserted default articles. Go to '/articles' to see them. </h1>");
        });
      } else{
        //console.log("articles found for default GET Route: %o", articlesFound);
        res.send("<h1> Delete present articles to insert default ones.</h1>");
      }

    }else{
      res.send(err);
    }
  });

});


///////////////////// Requests Targetting All Articles

app.route("/articles")

.get(function(req, res){

  Wiki.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    } else{
      res.send(err);
    }
  });

})

.post(function(req, res){
  //console.log(req.body.title);
  //console.log(req.body.content);

  const newArticle = new Wiki({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("<h1>Successfully added new article</h1>");
    } else{
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Wiki.deleteMany(function(err){
    if(!err){
      res.send("<h1>Successfully <strong>deleted</strong> all articles.</h1>");
    } else{
      res.send(err);
    }
  });

});

///////////////////// Requests Targetting a Specific Article

app.route("/articles/:specifiedArticle")

.get(function(req, res){
  const article = req.params.specifiedArticle;
  Wiki.findOne({title: article}, function(err, articleFound){
    if(!err){
      if(articleFound!=null && articleFound!=""){
        res.send(articleFound);
      } else{
        res.send("<h1>There was no article by that name.</h1>");
      }

    } else{
      res.send(err);
    }
  });
})

.put(function(req, res){
  const article = req.params.specifiedArticle;

  Wiki.replaceOne(
  {title: article},
  {title: req.body.title, content: req.body.content},
  function(err){
    if(!err){
      res.send("<h1>Successfully replaced document.</h1>");
    }else{
      res.send(err);
    }
  });
})

.patch(function(req, res){
  const article = req.params.specifiedArticle;

  Wiki.findOneAndUpdate(
  {title: article},
  {$set: req.body},
  function(err, docUpdated){
    if(!err){
      res.send("<h1> Successfully updated document.</h1>");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  const article = req.params.specifiedArticle;

  Wiki.findOne(
  {title: article},
  function(err, articleFound){

    if(!err){
    //  console.log("The article Found: ");
      //console.log(articleFound);

      if(articleFound != null){
        articleFound.deleteOne();
        res.send("<h1> Successfully deleted document.</h1>");
      } else{
        res.send("<h1> Err 404: No such document found.</h1>");
      }

    } else{
      res.send(err);
    }
  });
});
