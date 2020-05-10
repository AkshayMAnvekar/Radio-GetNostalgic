const https = require('https');

function get(url){
    return new Promise((resolve, reject)=>{
        https.get(url, (res)=>{
            let data = '';
            // console.log("CODE : ",res.statusCode)
            if (res.statusCode == 301 || res.statusCode == 302 ) {
                data = '';
                let socket = res.socket

                var connect = Object.getOwnPropertySymbols(socket).find(function(s) {
                    return String(s) === "Symbol(connect-options)";
                });
                
                connect = socket[connect]

                // console.log(connect)
                
                let url = connect.protocol+"//"+connect.host+res.headers.location
                console.log("redireccting to : ", url);
                resolve(get(url));
            }else{
                res.on('data', (chunk)=>{
                    data += chunk;
                })

                res.on('end', ()=>{
                    resolve(data)
                })
            }            
        }).on('error', (err)=>{
            console.log("HttpsService Error : ", err);
            reject(err)
        })
    })    
}

function post(url, data, callback){
    
}

module.exports = {
    'get': get,
    'post': post
}