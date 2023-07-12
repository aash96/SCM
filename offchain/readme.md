# offchain
## index.js
uses `gettok` function to get JWT token of blockchain network.\
the token is used to send further requests to blockchain.
## Endpoints
- `/` : create certificate usecase. Uses multer middleware for handling formdata. File should be stored with key - `file`
- `/download` (GET): downloads queried certificate
- `/gethash` (GET): retreive hash from blockchain (uses gettok for authenticating)invokes smartcontract
