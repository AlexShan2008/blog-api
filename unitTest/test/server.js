'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',function(req, res){
  res.send('ok');
});



app.get('/post',function(req,res){
  res.json(req.body);
});