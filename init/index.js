const mongoose = require('mongoose');
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main() .then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ //assign owner to the listing.
      ...obj, owner: '684e4d7c141f7711df158719'
    }));
    await Listing.insertMany(initData.data);
    console.log("data was added to db");
}

initDB();

