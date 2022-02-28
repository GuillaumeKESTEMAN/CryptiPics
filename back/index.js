const express = require('express');
const app = express();

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.get('/', (req, res) => {
    res.send("HELLO WORLD");
});



//---------------------------------------------------

const port = process.env.PORT || 3000;
let message = '...';

function messagePoint(){
    setInterval(function (){
        process.stdout.cursorTo(0);
        process.stdout.clearLine();
        if(message === ''){
            message = '.';
        }else if(message === '.'){
            message = '..';
        }else if(message === '..'){
            message = '...';
        }else if(message === '...'){
            message = '';
        }
        process.stdout.write(`Listening on port ${port}${message}`);
    },700);
}

app.listen(port, () => messagePoint());