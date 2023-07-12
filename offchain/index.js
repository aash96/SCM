const { MongoClient } = require('mongodb');
const express = require("express");
const multer = require("multer");
const upload = multer(); // { dest: "uploads/" } for filesystem storage
const cors = require('cors');
const fs = require("fs");
const axios = require("axios");
const stream = require('stream');
//const { hash } = require('bcryptjs');
const { createHash } = require('crypto');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//can make this restricted to mysql server and blockchain only - so that others can't access it
app.use(cors({
    origin: '*'
}));

app.listen(3330, () => {
    console.log(`Server started on port 3330`);
});

//handles creation of certificate
app.post("/", upload.single("file"), uploadFile);

const uri = "mongodb+srv://dbuser1:dbpass@cluster0.sywgrvm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

var collection;
client.connect((err,client)=>{if(err)console.log(err);else {
    var db = client.db("OffChain");
    collection = db.collection('files');
    }
});

function hashfn (s){ //calculates hash
    return createHash('sha256').update(s).digest('hex'); 
};

//logs in to blockchain gets JWT
async function gettok (){
    var data = JSON.stringify({
        "username": "ashwin1",
        "orgName": "Org1"
      });
      
      var config = {
        method: 'post',
      maxBodyLength: Infinity,
        url: 'http://localhost:4000/users/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      const result = await axios(config)
      .then(function (response) {
        return response.data["message"]["token"];
      })
      .catch(function (error) {
        console.log(error);
      });   
      return result;
}



async function uploadFile(req,res)
{
    if(req.body.CertID == '' || req.body.CertID === undefined)
    res.status(402).send("Enter CertID");

    const cert = req.body;

    //if file provided by user store it in certificate
    if(req.file){
        cert["file"]= "true",
        cert["filename"]=req.file.originalname,
        cert["filecontent"]=req.file.buffer.toString('base64');
    };

        //creating certificate.json from certificate object
        var jsondoc = JSON.stringify(cert);
        fs.writeFileSync('../certificate.json',jsondoc);

        //now mongodoc should be like {certid,certificate(file as string)}
        var mongodoc = {"CertID":req.body.CertID};
        var filec = fs.readFileSync("../certificate.json")
        mongodoc["certificate"]= filec.toString('base64');  //store as string in mongodb


        //uploading to MongoDb
        collection.insertOne(mongodoc, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error inserting certficate into MongoDB');
            }
        });

        //calculate hash
        const hash= hashfn(filec);

        console.log(hash);

        //uploading to blockchain
        var tok;      
        await gettok().then(resultok => tok = resultok)
        .catch(errtok => console.log(errtok));
        var data = JSON.stringify({
        "fcn": "CreateCert",
        "peers": [
            "peer0.org1.example.com",
            "peer0.org2.example.com"
        ],
        "chaincodeName": "fabsc",
        "channelName": "mychannel",
        "args": [
            "CERT"+req.body.CertID,
            req.body.CertID,
            Date.now(),
            hash
        ]
        });

        var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/channels/mychannel/chaincodes/fabsc',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': 'Bearer '+tok
        },
        data : data
        };

        axios(config)
        .then(function (response) {
        console.log("createcert res: "+response);
        res.json({"message":"uploaded to blockchain"});
        })
        .catch(function (error) {
        });
}

// below two functions need to be implimented in mysql server if we want to remove cors as discussed above
//for now we are allowing client to request directly

app.get("/download",(req,res)=>{
    console.log(req.query.CertID);

        collection.findOne({CertID: req.query.CertID},async(err,fileData)=>{
            if(err){
                console.log(err);
                return res.status(500).send('Error finding document');
            }
            if(!fileData) return res.status(500).send('Error finding document');
            var fileContents = Buffer.from(fileData.certificate, "base64");
            var readStream = new stream.PassThrough();
            readStream.end(fileContents);
            // res.set('Content-disposition', 'attachment; filename=' + fileData.filename);
            res.set('Content-disposition', 'attachment; filename=certificate.json');
            readStream.pipe(res);
        });
  });


app.get("/gethash",async (req,res) => {
    //Search blockchain
    var tok;      
    await gettok().then(resultok => tok = resultok)
    .catch(errtok => console.log(errtok));
      
    var config = {
    method: 'GET',
    url: 'http://localhost:4000/channels/mychannel/chaincodes/fabsc?args=[\"CERT'+req.query.CertID+'\"]&peer=peer0.org1.example.com&fcn=QueryCert',
    headers: { 
        'Authorization': 'Bearer '+tok
    },
    };

    var result = await axios(config)
    .then(resp => resp.data.result) ///will return json if found
    .then(data => {console.log(data);return data;})
    .catch(error => { console.log(error); return {"msg":"error"} });

    res.send(JSON.stringify(result));
})
