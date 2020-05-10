const net = require("net");
const os = require("os");
const { HttpsService } = require('../Components').NetworkService;

const config = require("../config")

let client;

async function executeCommand(cmd, cb){
    try{
        client = new net.Socket();
        client.connect({ port: 1234 });

        client.on('connect', function(){
            console.log("Connection established with TELNET");
            client.write(cmd+"\r\n");
        });

        client.on("data", function(data){
            console.log(typeof data);
            let str = data+"".replace(/\r/g,"").replace(/\"/g,"");
            data = str.split("\n");
            cb(null, data);
            client.destroy();
            console.log("Destroyed from DATA event")
        });

        client.on("error", ()=>{
                console.log("Error Occurred")
        })
    }catch(err){
        cb(err);
        console.log("Destroyed from Catch block")
        client.destroy();
    }
}

async function tempExecuteCommand(cmd, cb){
    try{
        let data = await HttpsService.get(`${config.SERVER_URL}/execute?cmd=${encodeURIComponent(cmd)}`)
        // console.log(typeof data)
        data = JSON.parse(data)
        cb(null, data.data)
    }catch(err){
        cb(err);
    }
}

function promisifyExecuteCommand(cmd){
    return new Promise((resolve, reject)=>{
        tempExecuteCommand(cmd, (err, data)=>{
            if(err){
                reject(err)
            }else{
                resolve(data);
            }
        })
    })
}

// tempExecuteCommand('request.alive', (err, res)=>{
//     if(err){
//         console.log({err})
//     }else{
//         console.log({res})
//     }
// })

module.exports = {
    executeCommand: os.platform() === 'win32' ? promisifyExecuteCommand : executeCommand
}