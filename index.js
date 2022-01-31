const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

app.use('/',express.static('public'));
app.use(bodyParser.urlencoded());

app.get('/',function(req,res){
    res.sendFile(__dirname+'/signup.html');
});

app.post('/failure',function(req,res){
    res.redirect('/');
})

app.post('/',function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    if (!firstName || !lastName || !email) {
        res.sendFile(__dirname+"/failure.html");
        return;
    }

    const data ={
        members: [
            {
                email_address: email,  //string
                status: "subscribed",  //string
                merge_fields: {       //object
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    fetch('https://usX.api.mailchimp.com/3.0/lists/<YOUR_AUDIENCE_ID>', {
    method: 'POST',
    headers: {
      Authorization: 'auth <YOUR_API_KEY>'
    },
    body: jsonData
  })
    .then(res.statusCode === 200 ?
        res.sendFile(__dirname+"/success.html"):
        res.sendFile(__dirname+"/failure.html"))
    .catch(err => console.log(err))
});

app.listen(8000,function(err){
    if(err){
        console.log('Error in running server');
        return;
    }
    console.log('Server is running on port 8000');
});
