const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const userRoute = require('./routes/users');
const pinRoute = require('./routes/pins');
const cors = require('cors');
const path = require('path');
const { response } = require('express');
dotenv.config();

app.use(express.json());

mongoose
    .connect(
        process.env.MONGO_URL,
        {
            useUnifiedTopology: true,
        })
    .then(() => {
        console.log("MongoDB conectat!")
    }).catch(err => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);


app.use(express.static(path.join(__dirname, "./frontend/build")));

app.get("*", function (_, res) {
    res.sendFile(
        path.join(__dirname, "./frontend/build/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});

const port = process.env.PORT || 8181;
app.listen(port, () => console.log(`Backend-ul pornit! ${port}`));
