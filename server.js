const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

mongoose.Promose=global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Post}=require('./models');

app.use(bodyParser.json());
app.use(morgan('common'));


app.get('/posts', (req,res)=>{
	Post
		.find()
		.limit(10)
		.then(posts =>{
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