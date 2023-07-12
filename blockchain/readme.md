# Blockchain
- ` ~/BasicNetwork-2.0/artifacts/channel$ ./create-artifacts.sh `
    - creates crypto-config folder,genisis.block,transaction files,anchor peers tx files
- `~/BasicNetwork-2.0/artifacts$ docker-compose up -d`
    - main command for network up, run containers
    - run `docker ps` to check runnning containers
- `~/BasicNetwork-2.0$ ./createChannel.sh`
    - creates `mychannel.block` in `channel-artifacts/`
    - `docker exec -it peer0.org1.example.com sh` opens peer container
    - inside peer, `peer channel list` shows channels joined by peer
- `~/BasicNetwork-2.0$ ./mydeployCCContractApi.sh `
    - deploy chaincode using Contract API(chaincode layer)
    - does 10 steps of chaincode lifecycle package,install,query,approve,commit readyness,commit,querycommit,invoke init,invoke,query
    - check before executing
- fabric SDK layer
    - Api2.0 (fabric network)
    - install dependencies first `~/BasicNetwork-2.0/api-2.0$ npm install`
    - absoulte certificate string with `\n` appended in a single line required in `api-2.0/config/connection-org(x).json`
    - `~/BasicNetwork-2.0/api-2.0/config$ ./generate-ccp.sh ` takes care of generating the config/json files
    - `ananya@ananya-H310M-H-2-0:~/BasicNetwork-2.0/api-2.0$ node app.js` main command for creating backend server that handles RESTful APIs
    - API endpoints & Request formats for usecases
        - register user :   
        var myHeaders = new Headers();   
        myHeaders.append("Content-Type", "application/json");   
            var raw = JSON.stringify({  
            "username": "ashwin1",  
            "orgName": "Org1"  
            });  
            var requestOptions = {  
            method: 'POST',  
            headers: myHeaders,  
            body: raw,  
            redirect: 'follow'   
            };  
            fetch("http://localhost:4000/users", requestOptions)    
            .then(response => response.text())   
            .then(result => console.log(result))   
            .catch(error => console.log('error', error));  
        - login user:  
        var myHeaders = new Headers();  
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer {token}");  
        var raw = JSON.stringify({
        "username": "ashwin1",
        "orgName": "Org1"
        });
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,  
        redirect: 'follow'  
        };  
        fetch("http://localhost:4000/users/login", requestOptions)  
        .then(response => response.text())  
        .then(result => console.log(result))  
        .catch(error => console.log('error', error));  
        - Create Certificate :
        var myHeaders = new Headers();  
myHeaders.append("Content-Type", "application/json");  
myHeaders.append("Authorization", "Bearer {token}");  
var raw = JSON.stringify({  
  "fcn": "CreateCert",  
  "peers": [  
    "peer0.org1.example.com",  
    "peer0.org2.example.com"  
  ],  
  "chaincodeName": "fabsc",  
  "channelName": "mychannel",  
  "args": [  
    "CERT3",
    "time",
    "hash"
  ]  
});  
var requestOptions = {  
  method: 'POST',  
  headers: myHeaders,  
  body: raw,  
  redirect: 'follow'  
};  
fetch("http://localhost:4000/channels/mychannel/chaincodes/fabsc",   requestOptions)  
  .then(response => response.text())  
  .then(result => console.log(result))  
  .catch(error => console.log('error', error));    
        - Query Certificate by ID:  
        var myHeaders = new Headers();  
myHeaders.append("Authorization", "Bearer {token}");  
var requestOptions = {  
  method: 'GET',  
  headers: myHeaders,  
  redirect: 'follow'  
};  
fetch("http://localhost:4000/channels/mychannel/chaincodes/fabsc?args=[\"CERT3\"]&peer=peer0.org1.example.com&fcn=QueryCert", requestOptions)  
  .then(response => response.text())  
  .then(result => console.log(result))  
  .catch(error => console.log('error', error));  
        - Query All Certificates  
        var myHeaders = new Headers();  
myHeaders.append("Authorization", "Bearer {token}");  
var requestOptions = {  
  method: 'GET',  
  headers: myHeaders,  
  redirect: 'follow'  
};  
fetch("http://localhost:4000/channels/mychannel/chaincodes/fabsc?  peer=peer0.org1.example.com&fcn=QueryAllCerts", requestOptions)  
  .then(response => response.text())  
  .then(result => console.log(result))  
  .catch(error => console.log('error', error));    
- `docker [stop/rm] $(docker ps -q)` Stops/removes all containers. -a for all
# Endpoints


