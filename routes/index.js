var express = require('express');
const Db = require('mongodb/lib/db');
const https = require('https');
var router = express.Router();
var qs = require('querystring');
const { render } = require('pug');
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
router.get('/mailer', function(req, res, next) {
  //req.session.contact = new Object();
  res.render('mailer', { });
});

router.post('/mailer', function(req, res, next) {
  //req.session.contact = new Object();
  res.render('mailer', { });
});

router.post('/thankyou', function(req, res, next) {

  const address = req.body.street + ", " + req.body.city + ", " + req.body.states + " " + req.body.zip
  const normalized = encodeURIComponent(address);
  const apikey = 'pk.eyJ1Ijoia3doaXRlNiIsImEiOiJjbDJhdXhndTQwMGc3M2JvZHZzaDdycHN2In0.7ABhNIpSMIP9RYBurLU8ug';
  var apiurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + normalized + '.json?access_token=' + apikey;

  https.get(apiurl, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      var addressInfo = JSON.parse(data);
      var long = addressInfo.features[0].center[0];
      var lat = addressInfo.features[0].center[1];

      let createContact = {
        prefix: req.body.prefix,
        fname: req.body.fname,
        lname: req.body.lname,
        name : req.body.prefix + " " + req.body.fname + " " + req.body.lname,
        street : req.body.street,
        city : req.body.city,
        state : req.body.states,
        zip : req.body.zip,
        address: req.body.street + ", " + req.body.city + ", " + req.body.states + " " + req.body.zip,
        phone: req.body.phone,
        email: req.body.email,
        contactBy: req.body.contacts,
        latitude: lat,
        longitude: long,
        cbm: req.body.chkmail,
        cbp: req.body.chkphone,
        cbe: req.body.chkemail,
        cba: req.body.chkany
      }
    
      console.log(createContact);
      req.mycontacts.insertOne(createContact);

    });
  })
  .on('error', (error) => {
    console.log(error);
  });

  

  res.render('thankyou', {});
});

router.get('/contacts', function(req, res, next) {

  async function getContacts() {
    const cArr = await req.mycontacts.find().toArray();
    console.log(cArr);
    res.render('contacts', {'contactArr': cArr});

  }

  getContacts();

  
});

router.get('/contactedit/:id', function(req, res, next) {
  //const contactID = { id : req.body.id};
  req.mycontacts.findOne({_id : ObjectId(req.params.id)}, function(err, contactToUpdate) {
    console.log(contactToUpdate)
    res.render('contactedit', {'con' : contactToUpdate})
  });
});

/*router.post('/contactedit/:id', function(req, res, next) {
  console.log(req.params.id);
  //const contactID = { id : req.body.id};
  

});*/

router.get('/deletecontact/:id', function(req, res, next) {
  //const contactID = { };
  //console.log(contactID);
  console.log(req.params.id);
  req.mycontacts.deleteOne({_id : ObjectId(req.params.id)}, function(err) {
    res.redirect('/contacts');
    //res.render('deletecontact', {});
  });
});

router.post('/updatesuccessful', function(req, res, next) {
  const address = req.body.street + ", " + req.body.city + ", " + req.body.states + " " + req.body.zip
  const normalized = encodeURIComponent(address);
  const apikey = 'pk.eyJ1Ijoia3doaXRlNiIsImEiOiJjbDJhdXhndTQwMGc3M2JvZHZzaDdycHN2In0.7ABhNIpSMIP9RYBurLU8ug';
  var apiurl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + normalized + '.json?access_token=' + apikey;

  https.get(apiurl, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
  });

  response.on('end', () => {
    var addressInfo = JSON.parse(data);
    var long = addressInfo.features[0].center[0];
    var lat = addressInfo.features[0].center[1];

    req.mycontacts.updateOne({_id : ObjectId(req.body.currentid)},
      {$set: {prefix: req.body.prefix,
      fname: req.body.fname,
      lname: req.body.lname,
      name : req.body.prefix + " " + req.body.fname + " " + req.body.lname,
      street : req.body.street,
      city : req.body.city,
      state : req.body.states,
      zip : req.body.zip,
      address: req.body.street + ", " + req.body.city + ", " + req.body.states + " " + req.body.zip,
      phone: req.body.phone,
      email: req.body.email,
      contactBy: req.body.contacts,
      latitude: lat,
      longitude: long,
      cbm: req.body.chkmail,
      cbp: req.body.chkphone,
      cbe: req.body.chkemail,
      cba: req.body.chkany}},
      {upsert: true})

    });

    res.redirect('/contacts');
  
  });


});

module.exports = router;
