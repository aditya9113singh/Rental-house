const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");


const expressError=require("./utility/expressError.js");

const listings=require("./routes/listing.js");


const reviews=require("./routes/review.js");

const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(methodOverride("_method"));



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("hi i am root");
})

/*app.get("/testlistings",async (req,res)=>{
    let samplelisting=new Listing({
        title:"Cheese Burst",
        description:"loaded with Cheese",
        price: 1200,
        location: "Noida",
        type:"veg",
    });

    await samplelisting.save();
    console.log("sample was saved");
    res.send("Succesfull");
});*/

//listings
app.use("/listings",listings);

//reviews
app.use("/listings/:id/reviews",reviews)



//error handling
app.all("*",(req,res,next)=>{
    next(new expressError(404,"page not found"));
});
//middleware
app.use((err,req,res,next)=>{
    let{status=500,message="error"}=err;
    res.status(status).render("error.ejs",{message});
})

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));


app.listen(8080,()=>{
    console .log("working");
})