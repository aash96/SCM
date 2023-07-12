# backend
## router.js 
All the routes are defined here.\
For `Create-certificate` usecase sends requests to Mongo server after creating new row in Certificate table.
## validator.js
Middleware for requests in `router.js`\
Checks if user is logged in using JWT tokens.
## db.js
contains MySQL credentials
## Endpoints
- `/sign-up` : signup - Also returns userid created
- `/login` : Gives the token required for further requests
- `/` : Dashboard - Returns list of Supplychains
- `/createsc` : Create new supplychain
- `/members` : returns list of suppplychain members for the queried sc_id
- `/assign-role` : Add supplychain members(existing userid) along with their roles.
- `/create-shipment` : Create shipment for a given supplychain returns shipmentID
- `/get-shipments` : returns list of shipments in a supplychain
- `/create-certificate` : handles certificate as formdata - sends to mongo server


    