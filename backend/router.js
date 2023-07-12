const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const request = require("request");
const axios = require('axios');
//const fetch = require('node-fetch');
const http = require('http');
const FormData = require('form-data')


const db = require('./db.js');
const userMiddleware = require('./validator.js');
const { response } = require('express');
const upload = multer();


router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        `SELECT * FROM Person WHERE LOWER(Username) = LOWER(${db.escape(
          req.body.username
        )});`,
        (err, result) => {
          if (result.length) {
            return res.status(409).send({
              msg: 'This username is already in use!'
            });
          } else {
            // username is available
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  msg: err
                });
              } else {
                // has hashed pw => add to database
                db.query(
                  `INSERT INTO Person (Username, Password, Email, LastLogin) VALUES (${db.escape(
                    req.body.username
                  )}, ${db.escape(hash)},${db.escape(req.body.email)}, now())`,
                  (err, result) => {
                    if (err) {
                      return res.status(400).send({
                        msg: err
                      });
                    }
                    console.log(result);
                    return res.status(201).send(result); //result contains insertId = userID created 
                  }
                );
              }
            });
          }
        }
      );
});

router.post('/login', (req, res) => {
    db.query(
        `SELECT * FROM Person WHERE Username = ${db.escape(req.body.username)};`,
        (err, result) => {
          // user does not exists
          if (err) {
            return res.status(400).send({
              msg: err
            });
          }
          if (!result.length) {
            return res.status(401).send({
              msg: 'Username is incorrect!'
            });
          }
          console.log(result[0]);
          // check password
          bcrypt.compare(
            req.body.password,
            result[0].Password,
            (bErr, bResult) => {
              // wrong password??x
              if (bErr) {
                return res.status(401).send({
                  msg: 'Password is incorrect!'
                });
              }
              if (bResult) {
                const token = jwt.sign({
                    Username: result[0].Username,
                    UserId: result[0].idPerson
                  },
                  'SECRETKEY', {
                    expiresIn: '7d'
                  }
                );
                db.query(
                  `UPDATE Person SET LastLogin = now() WHERE idPerson = '${result[0].idPerson}'`
                );
                return res.status(200).send({
                  msg: 'Logged in!',
                  token,
                  user: result[0],
                  status: true
                });
              }
              else
              return res.status(401).send({
                msg: 'Username or password is incorrect!'
              });
            }
          );
        }
      );
});

router.get('',userMiddleware.isLoggedIn, (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
  req.userData = decoded;
  console.log(decoded);
  db.query(
    `SELECT * FROM Supplychain where OwnerID = ${decoded.UserId}`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      console.log(JSON.stringify(result));
      return res.status(201).send(
        result
      );
    }
  );
});

router.post('/createsc',userMiddleware.isLoggedIn, (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
  req.userData = decoded;
  console.log(decoded);
  db.query(
    `INSERT INTO Supplychain (TimeCreated, Product, OwnerID) VALUES (now(), ${db.escape(req.body.product)}, ${decoded.UserId})`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(201).send(result);
    }
  );
});

router.get('/members',userMiddleware.isLoggedIn,(req,res,next)=>{
  db.query(
    `SELECT PersonID, Role from Role where SupplychainID = ${db.escape(req.query.sc_id)}`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      console.log(result);
      return res.status(201).send(result);
    }
  );
});

router.post('/assign-role',userMiddleware.isLoggedIn, (req, res, next) => {
  db.query(
    `INSERT INTO Role (Role,SupplychainID,PersonID) VALUES (${db.escape(req.body.role)}, ${req.body.sc_id},${db.escape(req.body.member_id)})`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(201).send({
        msg: 'Added member!'
      });
    }
  );
});

router.post('/create-shipment',userMiddleware.isLoggedIn, (req, res, next) => {
  //can query the database for ownership for more security
  db.query(
    `INSERT INTO Shipment (TimeCreated, Quantity, SupplychainID) VALUES (now(), ${db.escape(req.body.quantity)}, ${req.body.sc_id})`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(201).send(result);
    }
  );
});

router.get('/get-shipments',userMiddleware.isLoggedIn, (req, res, next) => {
  db.query(
    `SELECT * FROM Shipment where SupplychainID = ${req.query.sc_id}`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      return res.status(201).send(
        result
      );
    }
  );
});

router.post('/create-certificate',[userMiddleware.isLoggedIn,upload.single("file")],async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SECRETKEY'
      );
  //improvements: shipmentID verification - is he the owner
  db.query(
    `INSERT INTO Certificate (TimeCreated, IssuerID, ShipmentID) VALUES (now(), ${decoded.UserId}, ${db.escape(req.body.shipment_id)})`,
    async (err, sqlresult) => {
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
    //connect to mongo server
    form = new FormData();
    for(j in req.body)
    {
      form.append(j,req.body[j])
    }

    form.append('CertID',sqlresult.insertId);

    if(req.file)
      form.append("file", req.file.buffer, {filename: req.file.originalname});
  
    var config = {
      method: 'post',
      url: 'http://localhost:3330',
      headers: {...form.getHeaders()},
      data : form
    };

    const result = await axios(config)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });

    console.log(result);
    return res.status(201).send({"CertID":sqlresult.insertId});
  }
  );
});

module.exports = router;