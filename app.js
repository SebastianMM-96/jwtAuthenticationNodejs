const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res)=>{
    res.json({
        message : 'Welcome to the API'
    });
});

/** Protect */
app.post('/api/posts', verifyToken, (req, res)=>{

    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message : 'Post created',
                authData
            });
        }
    });
});

app.post('/api/order', (req, res)=>{
    const order = {
        id : 1,
        order_number : '01'
    };

    jwt.sign({order}, 'secretkey', (err, token)=>{
        res.json({
            token
        })
    });
});

/** Verify token  */
function verifyToken(req, res, next){
    /** Get the auth header value */
    const bearerHeader = req.headers['authorization'];
    /** check if is undefined */
    if(typeof(bearerHeader) !== 'undefined'){
        /** Split at the space */
        const bearer = bearerHeader.split(' ');
        /** get token from array */
        const bearerToken = bearer[1];
        /** set token */
        req.token = bearerToken;
        next();
    }else{
        /** Forbidden */
        res.sendStatus(403);
    }

}

app.listen(
    5000, ()=>{
        console.log('Server started on port 5000');
    }
);