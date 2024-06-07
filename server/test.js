import express from 'express';
import connect from './config/connection.js';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    try{
        res.json("home route");
    }catch(error){
        res.json({error});
    }
});

connect().then(() => {
    try{
        app.listen(PORT, () => {
            console.log(`Server now running on port ${PORT}!`);
        })
    }catch(error){
        console.log(`No connection ${error}`);
    }
}).catch((error) => {
    console.log("cant get database");
});