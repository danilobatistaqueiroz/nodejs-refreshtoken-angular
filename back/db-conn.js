const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, 
{
    authSource: "admin",
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PWD,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then((data) => {
      console.log(`Database connected to ${data.connection.host}`)
})
  .catch((err) => {
    console.error(err.stack);
});