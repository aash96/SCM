const express = require('express');
const app = express();
const cors = require('cors');

// set up port
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
    origin: '*'
}));

// add routes
const router = require('./router.js');
app.use('/api', router);

// run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));