import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
const port = process.env.port|| 3000;
const api = "https://ssd-api.jpl.nasa.gov/cad.api";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.listen(port,(req,res)=>{
    console.log(`Server is actively listening at ${port}.`);
});

app.get("/",(req,res)=>{
    res.render("home.ejs");
})

app.post("/search",async (req,res)=>{
    console.log(req.body);
    let minDate = req.body["from"];
    let maxDate = req.body["to"];
    let resp = "";
    if(minDate&&maxDate){
        resp = await axios.get(`${api}?date-min=${minDate}&sort=dist&limit=1`);
    }
    else if(minDate){
        resp = await axios.get(`${api}?date-min=${minDate}&sort=dist&limit=1`);
    }
    else if(maxDate){
        resp = await axios.get(`${api}?date-max=${maxDate}&sort=dist&limit=1`);
    }
    else{
        resp = await axios.get(`${api}?sort=dist&limit=1`);
    }
    let countOfBodyies = resp["data"]["count"];
    let allBody = resp["data"]["data"];
    let headings = ["Description","Orbit ID","Empherical Time","Common Time","Distance","Minimum Distance","Maximum Distance","Relative Velocity","Velocity","Uncertainity","Magnitude"];
    let data = {};
    for(let i = 0; i<headings.length ;i++){
        data[headings[i]] = allBody[0][i];
    }


    for(let key in data){
        if(data.hasOwnProperty(key)){
        console.log(data[key]);
        }
    }
    let dataSent = {
        data : data
    }


    // console.log(data);
    res.render("details.ejs",dataSent);
})


