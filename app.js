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

//ENDPOINT TO RETRIEVE PRODUCTS AVAILABLE
app.get('/products',async(req,res)=>{
    try {
        let response = await crud.getProducts();
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})

app.get('/products/:id', async(req, res)=>{
    try {
        let response = await crud.getProductById(req.params.id);
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})

app.get('/products/departments/:id',async(req, res)=>{
    try {
        let response = await crud.getProductsByDepartment(req.params.id);       
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})

app.get('/products/categories/:id',async(req, res)=>{
    try {
        let response = await crud.getProductsByCategory(req.params.id);       
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})

app.get('/products/subcategories/:id',async(req, res)=>{
    try {
        let response = await crud.getProductsBySubcategory(req.params.id);       
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})

app.get('/products/filtered/:departmentId/:categoryId/:subcategoryId',async(req, res)=>{
    let {departmentId, categoryId,subcategoryId} = req.params;
    console.log(req.params);
    try {
        let response = await crud.getProductsByFilters(departmentId, categoryId, subcategoryId);       
        res.status(200).send({message:response});
    } catch (error) {
        res.status(400).send();
    }
})