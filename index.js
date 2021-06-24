// This file is in charge of starting the application
const server = require("./server");
const persist = require("./persist");

//define a port
const port = process.argv[2] || process.env.PORT || 8080;

persist.connect(()=>{
    //start the server
    server.listen(port, ()=> {
        console.log(`Running Server on Port ${port}`)
    })
})
//connect to the databse
