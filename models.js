const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	title: {type: String, required: true},
	content:{type: String, required:true},
	author: {
		firstName: {type: String, required: true},
		lastName: {type:String, required: true}
	}
})

postSchema.virtual('authorName').get(function(){
	return `${this.firstName} ${this.lastName}`.trim()
});

postSchema.methods.serialize = function(){
	return{
		id: this._id,
		title: this.title,
		author: this.authorName,
		content: this.content
	}
}

const Post = mongoose.model('Post', postSchema);

module.exports = {Posts};