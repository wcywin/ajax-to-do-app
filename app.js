var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    bodyParser          = require("body-parser"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override");
    
mongoose.connect("mongodb://localhost/ajax_spa", {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

var todoSchema = new mongoose.Schema({
    text: String,
});

var Todo = mongoose.model("Todo", todoSchema);

app.get("/", function(req,res){
    res.redirect("/todos");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/todos", function(req, res){
  if(req.query.keyword){ // If there is a query string called keyword
      // set the constant regex equal to a new regex pulled from the query string
      const regex = new RegExp(escapeRegex(req.query.keyword), "gi");
      // query the DB for the Todos with the regex
      Todo.find({ text: regex}, function(err, todos){
        if(err){
          console.log(err);
        } else {
          res.json(todos);
        }
      });
  } else {
      // if there wasn't any query
      Todo.find({}, function(err, todos){
          if(err){
              console.log(err);
          } else {
              if(req.xhr){ // If req was made with AJAX
                  res.json(todos); // send back all todos as JSON
              } else {
                  res.render("index", {todos: todos}); // otherwise render the index view
              }
          }
      });
  }
});


app.get("/todos/new", function(req, res) {
    res.render("new");
});

app.post("/todos", function(req, res){
    req.body.todo.text = req.sanitize(req.body.todo.text);
    var formData = req.body.todo;
    Todo.create(formData, function(err, newTodo){
        if(err){
            console.log(err);
        } else {
            res.json(newTodo);
        }
    });
});

app.put("/todos/:id", function(req, res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, {new: true}, function(err, todo){
        if(err){
            console.log(err);
        } else {
            res.json(todo);
        }
    });
});

app.delete("/todos/:id", function(req, res){
    Todo.findByIdAndRemove(req.params.id, function(err, todo){
        if(err){
            console.log(err);
        } else {
            res.json(todo);
        }
    }); 
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running...");
});