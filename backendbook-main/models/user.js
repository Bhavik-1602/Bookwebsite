const mongoose =require("mongoose");

const user = new mongoose.Schema({
  username:{
    type:String,
    require:true,

  },
  email:{
    type: String,
    require:true,
    unique:true,

  },
  password:{
    type: String,
    require:true,
    

  },
  address:{
    type: String,
    require:true,
    

  },
  avatar:{
    type: String,
    default:"https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg",
    

  },
  role:{
    type: String,
    default: "user",
    enum:["user", "admin"],
  },
  favourites:[{
    type:mongoose.Types.ObjectId,
    ref:"bookRoutes",
  
  },
],

cart:[{
  type:mongoose.Types.ObjectId,
  ref:"bookRoutes",

},
],
orders:[{
  type:mongoose.Types.ObjectId,
  ref:"order",
  

},
],
}, {timestamps:true});
module.exports =mongoose.model("user", user)