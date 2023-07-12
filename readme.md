# Supply Chain Management System
Express is mainly used for creating servers.\
Axios is used for intermediate(server to server) communication.\
To start with navigate to `myfrontend/auth.html` for better experience - open console and analyse how dashboard works.\
Note: Node Version : `10.19.0`
## backend:
`node index.js` :  runs on PORT 3000\
Connects to `mysql` server and handles login and most of the user requests. For creating certificate sends request to offchain server but unique certificate ID created here.\
Uses JWT authentication
## offchain:
`node index.js` : runs on PORT 3330\
Connects to `MongoDB` server (Atlas).\
Directly handles download and hash verification requests.
## blockchain:
`node app.js` : runs on PORT 4000 \
Hyperledger Fabric network uses JWT authentication (For admins)\
Not exposed directly to users.\
Can check couch DB here: `http://localhost:7984/_utils/#database/mychannel_fabsc/_all_docs`
## myfrontend:
Frontend pages in html which act as primary UI.
## start.sh
script for starting all the services
## Q1.sql
sql script for creating tables in MYSQL
## versions.txt
recommended versions of software
## schema.png
MySQL database schema
##postmancollections :
import in POSTMAN to get request structures\
For flow of requests refer `notes.pdf` and `flow.png`
