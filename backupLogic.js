const {Tilder} = require('./model')
const persist = require("./persist");
var fs = require("fs");

function backupData(callback, index) {
    return_value = "";
    Tilder.find({}, (err, tilder)=>{
        callback(tilder, index);
    })
    
}
function writeData(data, index) {
    var myData = []
    for (const index in data){
        myData[index] = (data[index])
    }
    filePath = "temp" + index +".txt";
    fs.writeFile(filePath,JSON.stringify(myData), (err) => {
        if (err) console.log(err);
    });
}
function restoreData(callback, filePath){
    Tilder.find({}, (err, tilder)=>{
        tilder.forEach(mytilder => {
            Tilder.findByIdAndDelete(mytilder._id, (err, tilder)=>{
            });
        })
        callback(filePath);
    })
}

function loadFromFilePath(filePath){
    fs.readFile(filePath, "utf-8", (err, content) =>{
        var myData = JSON.parse(content);
        for (const index in myData){
            createTilder = myData[index];
                Tilder.create(createTilder,(err,tilder)=>{});
        }
    });
}
persist.connect(()=>{
    //start the server
    var i = 0
    setInterval(function(){
        //backupData(writeData, i);
        restoreData(loadFromFilePath, "temp6.txt");
        i++
        console.log(i)
},2500)
})
