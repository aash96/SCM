#!/bin/bash
cd backend
nodemon index.js &
cd ../blockchain/artifacts
docker stop $(docker ps -q)
docker-compose up -d
cd ../api-2.0
nodemon app.js &
cd ../../offchain
nodemon index.js &
 