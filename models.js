const mongoose = require('mongoose');

const postSchema = mongoose.Schema(

	{
	title: {type: String, required: true},
	content:{type: String, required:true},
	author: {
		firstName: {type: String, required: false},
		lastName: {type:String, required: false}
	}
})

postSchema.virtual('authorName').get(function(){
	return `${this.author.firstName} ${this.author.lastName}`.trim()
});

postSchema.methods.serialize = function(){
	return{
		id: this._id,
		title: this.title,
		author: this.authorName,
		content: this.content
	}
}

const Post = mongoose.model('Post', postSchema, 'blogPosts');

module.exports = {Post};