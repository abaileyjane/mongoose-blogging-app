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

