require("./src/config/database");
require("dotenv").config();
const customMiddleware = require('./src/middleware/responseFormat');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT =  process.env.PORT;
//----------ROUTES IMPORTATION------
const user = require('./src/routes/user');


app.use(express.json());
app.use(express.urlencoded())
app.use(customMiddleware)

//----------------ROUTES----------------
app.get('/user', (req, res) => {
    // Some logic to get data
    const data = { key: 'value' };
    res.jsonFormatted(200, data);
});
app.use('/user',user)



app.listen(PORT, (error) =>{
        if(!error)
            console.log("Server is Successfully Running,and App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);