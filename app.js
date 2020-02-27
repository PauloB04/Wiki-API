//jshint esversion:6
    //Server SetUp --->
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const favicon = require("serve-favicon");
const {dPosts, instructionArticles, Wiki, Instructions} = require(__dirname+"/appComp/defaultArticles");
const userName = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
let port = process.env.PORT;


(port==null||port=="") ? port=4000: port=port;

app.listen(port, ()=> console.log("Server runnning on port: "+port));

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(__dirname+'/public/imgs/favicon.ico'));


//Database Configuration --->
// const localUrl = "mongodb://localhost:27017/";
const remoteUrl = 'mongodb+srv://'+userName+':'+password+dbHost;
const dbName = "wikiDB";

// const localDbUrl = localUrl+dbName;
const remoteDbUrl =remoteUrl+dbName;

mongoose.connect(remoteDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(localDbUrl, {useNewUrlParser: true, useUnifiedTopology: true});


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
