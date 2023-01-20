const express = require('express');
const bodyParser = require('body-parser');
// instead of urlencoded
const bodyParserJson= bodyParser.json();

const fs = require('fs');
const app = express();

// any requist have body --> automatic parse it as json
app.use(bodyParserJson);

let contacts =[];
let settings = {
    counterId :1 
};
// get all contacts
app.get('/contacts', function(req, res){
    let resBody ={
        Success:true ,
        Error : "no error" ,
        Contacts : contacts
    }
    res.send(resBody);
})
// get contact by id
app.get('/contacts/:id', function(req, res){
    let contact = contacts.find(x => x.Id == req.params.id);
    let resBody ={
        Success:true ,
        Error : "no error" ,
        Contacts : contact
    }
    if(!contact){
        resBody.Success =false;
        resBody.Error = "Contact Not Found"
    }
    // req.params.id ;
    res.send(resBody);
})

// add contact 
app.post('/contacts',function(req, res){
    let resBody ={
        Success:true ,
        Error : "no error" ,
        Contacts :req.body
    }
    if(!req.body.Name ){
        resBody.Success = false;
        resBody.Error = "Must write a Name"
    }
    let existcontact = contacts.find(x => x.Name == req.body.Name);
    if(existcontact){
        resBody.Success =false;
        resBody.Error = "This Name is Already exist";
    }
    if(resBody.Success){
        req.body.Id = settings.counterId++;
        contacts.push(req.body);
        saveToFile();
    }
    res.send(resBody);
})
// update contact
app.put('/contacts', function(req, res){
    let contact = contacts.find(x => x.Id == req.body.Id);
    contact.Name = req.body.Name;
    contact.Phone = req.body.Phone;
    saveToFile();
    res.send(req.body);
})
// delete contact
app.delete('/contacts/:id' , function(req , res){
    let contactIndex = contacts.findIndex(x => x.Id == req.params.id);
    contacts.splice(contactIndex, 1);
    saveToFile();
    res.send({Success:true ,DeletedContactId : req.params.id } );
    // req.body.Id = settings.counterId--;

})
// save to file
function saveToFile(){
    fs.writeFile("contacts.file" , JSON.stringify(contacts) ,function(err){
        if(err){
            console.log(err);
        }
    })
    fs.writeFile("settings.file" , JSON.stringify(settings) ,function(err){
        if(err){
            console.log(err);
        }
    })
}
function loadFromFile(){
    fs.readFile("contacts.file" ,function(err , data){
        if(err){
            console.log(err);
        }
        else{
            contacts=JSON.parse(data);
        }
    });
    fs.readFile("settings.file" ,function(err , data){
        if(err){
            console.log(err);
        }
        else{
            settings=JSON.parse(data);
        }
    });
}

loadFromFile();



app.listen(8080);
