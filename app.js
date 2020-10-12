const express = require("Express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model("Article", articleSchema);

//////////////////////////////Resquest Targeting all articles\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/article")
.get(function(req, res){
  Article.find(function(err, result){
    if(!err){
      res.send(result)
    }else{
      res.send(err)
    }
  })
})
.post(function(req, res){
const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});

newArticle.save(function(err){
  if(!err){
    res.send("successfully saved to the database");
  }else{
    res.send(err);
  }
});

})
.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
    res.send("successfully deleted all items here");
    }else{
      res.send(err)
    }
  })
})

//////////////////////////////Requset Targeting Specific Route\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.route("/article/:articleTitle")
.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
  if(foundArticle) {
    res.send(foundArticle);
  } else{
    res.send("No articles was found!")
  }
});
})
.put(function(req, res){
  Article.findOneAndUpdate(
    {
      title: req.params.articleTitle
    },
    {
      title: req.body.title,
      content: req.body.content
    },
    {overwrite:true},
    function(err, docs){
      if(!err){
        res.send("successfully updated article.");
      }
    }
  )
})
.patch(function(req, res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("successfully saved");
      }else{
        res.send(err)
      }
    }
  )
})
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted in our database")
      }else{
        res.send(err)
      }
    }
  )
});


app.listen(3000, function(){
  console.log("server started on port 3000")
})
