const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

mongoose.Promise=global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Post}=require('./models');

app.use(bodyParser.json());
app.use(morgan('common'));


app.get('/blogPosts', (req,res)=>{
	Post
		.find()
		.then(posts=>{
			res.json({
				posts: posts.map(
					(post)=>post.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message:'Internal Server Error'});
		});
});

app.get('/seeds/:id', (req, res)=>{
	Posts
		.findById(req.params.id)
		.then(posts => res.json(posts.serialize()))
		.catch(err=>{
			conole.error(err);
			res.status(500).json({message:'Internal Server Error'});
		});
});

app.post('/blogPosts', (req, res)=>{
	Post
		.create({
			title: req.body.title,
			content: req.body.content,
			author:{
				firstName: req.body.author.firstName,
				lastName: req.body.author.lastName}
		})
		.then(blogPosts => res.status(201).json(blogPosts.serialize()))
		.catch(err=>{
			console.error(err);
			res.status(500).json({message:'Internal Server Error'});
		});
})

app.put('/blogPosts/:id', (req, res)=>{
	const idParams = req.params.id.toString();
	if(idParams!==req.body.id){
		console.error('ids do not match');
		return res.status(400).json({message: 'ids dont match'})
	};
	const updatableFields=['title', 'content', 'author.firstName', 'author.lastName'];

	for(let i=0; i<updatableFields.length; i++){
		if(updatableFields[i] in req.body){
			Post
				.findOneAndUpdate(idParams, {$set: {
												title:req.body.title,
												content:req.body.content,
												author:{ firstName: req.body.author.firstName,
														lastName: req.body.author.lastName}

													}
				})
				.then(posts=>res.status(204).end())
				.catch(err=> res.status(500).json({message:'Internal Server Error'}))

		}
	}
})


app.delete('/blogPosts/:id', (req, res)=>{
	Post
		.findByIdAndRemove(req.params.id)
		.then(posts => res.status(204).end())
		.catch(err=>{
			res.status(500).json({message: 'Internal Server Error'})
		});
})

function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}



// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };