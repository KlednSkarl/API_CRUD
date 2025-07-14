const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { error } = require('console');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());



const dbconfig = {
    user:process.env.DB_user,
    password:process.env.DB_password,
    server:process.env.DB_server,
    port:parseInt(process.env.DB_PORT),
    database:process.env.DB_NAME,
    options: {
        encrypt:true,
        trustServerCertificate: true,
    }



}; // nandito lahat ng creds pang login sa SQL


sql.connect(dbconfig).then(pool => {
console.log("Connected to SQL database");
 



app.get("/tbl",async(req,res)=>{
    try{
        const result = await pool.request().query("Select * from CS_TblLnClass");
        res.json(result.recordset);
    }catch (err){
        res.status(500).send(err.message);
    }

});
// select * sa lahat



app.post("/tbl",async (req,res)=> {
const {code,descr} = req.body;

    try{
        await pool.request()
        .input("code",sql.VarChar,code)
        .input("descr",sql.VarChar,descr)
        .query("INSERT into CS_TblLnClass (code,descr) values (@code,@descr)");
        res.send("Loan Class Added");
    } catch (error){
        console.error("Insert Error:", error);
        res.status(500).send(error.message);
    }
});
// above code is for insert query



app.put("/tbl/:code",async (req,res) =>{ 
    const {code} = req.params;
    const {description} = req.body;

try{
    await pool.request()
    .input("code",sql.VarChar,code)
    .input("description",sql.VarChar,description)
    .query("Update CS_TblLnClass set descr = @description Where code = @code");

    res.send("Item updated");
}   catch(error){
    res.status(500).send(error.message);
}

});



// above code is for update query

app.delete("/tbl/:code",async (req,res) =>{
    const {code} = req.params;
    try{
        await pool.request().
        input("code",sql.VarChar,code)
        .query("Delete from CS_TblLnClass where  code = @code");
        res.send("Data deleted");
    }catch (err) {
        res.status(500).send(err.message);
    }


});// above code is for delete query


})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

