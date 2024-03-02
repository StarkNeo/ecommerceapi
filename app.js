const express = require('express');
const app =  express();
const crud = require('./crud');
const PORT = process.env.PORT || 3000;


//SERVER RISING
app.use(express.json());//important to receive json request
app.listen(PORT,()=>{
    console.log(`Server listen on port ${PORT}`);
})

//ENDPOINT TO SIGN UP
app.post('/register',async(req, res)=>{
    let response = await crud.findUser(req.body);
    console.log(response);
    res.status(200).send({message:response});
});
//ENDPOINT LOGIN TO GET A WEBTOKEN
app.post('/login',async(req,res)=>{
    try {
        let {user_name, password}=req.body;
        console.log(user_name, password);
        let response = await crud.authenticateUser(user_name, password)
        res.status(200).send({message:response});
    } catch (error) {
        console.log(error);
        res.status(400).send();
    }
    
})
