const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors')

const basename = "contacts.json";


let errMsg = "";

var app = express();

app.use(bodyParser.json());
app.use(cors());
app.get('/ccontact', function (req, res) { 
  res.send('Hello World!');
});

app.post('/new', async (req, res)=>{ 
    const base = await readBase();
    if(!base){
      console.log(errMsg);
    }
    let lastId = 0;
    if(base.contacts.length){;
      lastId = base.contacts[base.contacts.length - 1].id;
    } 
    let ccontact = {
      id: ++lastId,
      name: req.body.name,
      email: req.body.email,
      fone: req.body.fone,
      adress: req.body.adress
    }
    base.contacts.push(ccontact);
    if(await updateBase(base)){        
      return res.status(201).send();;
    }else{
      return res.status(400).send();
    }
    
});

app.get('/', (req, res) =>{
  const run = async () => {
    const base = await readBase();
    if(!base){
      console.log(errMsg);
    }           
    if(base.contacts){      
       return res.status(200).send(base.contacts);
    }
    return res.status(404).send({msg: `Erro`});
 
  }
  run();
});

app.listen(3000, function () {
  console.log('Ouvindo porta 3000...');
});

const readBase = () => new Promise((resolve, reject) => {
  fs.readFile(basename, 'utf8', (err, data) => {
    if (err){
      if(err.code === "ENOENT"){
        fs.writeFile(basename, "{\"contacts\": []}" ,'utf8', function(err){ 
          if(err)reject(err)
          else resolve(JSON.parse("{\"contacts\": []}"))
        });
      }else reject(err)        
    }        
    else resolve(JSON.parse(data))
  })
});

const updateBase = (base) => new Promise((resolve, reject) => {
  fs.writeFile(basename, JSON.stringify(base), 'utf8', function(err){
    if(err) reject (err)
    else resolve(true);
  });      
});  

