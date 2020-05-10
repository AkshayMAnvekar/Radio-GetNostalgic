const fs = require("fs")
const p = require("path")

const config = require("./config")
const { Resolver } = require("./Utils")
const { DatabaseService } = require("./Components")
let db = DatabaseService.conPromise

let path = config.TRACKS_PATH;
let list = [];

async function insertSong(obj){
    console.log("Inserting")
    let params = [obj.song_title, obj.original_song_title, obj.song_path]    
    let result = await db.run('insert into tracks(track_title, original_track_title, track_path) values(?,?,?)', params)
    console.log(result)
}

function recursicRead(path, files){
    fs.readdirSync(path).forEach(async function(file){   
        // console.log(file)
        var subpath = p.join(path,file);
        if(fs.lstatSync(subpath).isDirectory()){
            recursicRead(subpath, files);
        } else {
            if(file.includes(".mp3")){
                // let temp = undefined;                
                // if(file.includes("-")){
                //     let index = file.lastIndexOf("-")
                //     temp = file.substring(0, index).replace("_", " ").trim()
                // }
                let obj = {
                    song_title: Resolver.resolveTrackNameFromTrackPath(file), //temp ? temp : file.replace(".mp3", "").replace("_", " ").trim(),
                    original_song_title: file,
                    song_path: subpath,
                }
                files.push(obj);
                // await insertSong(obj);
            }            
        }
    });
}

setTimeout(async () => {
    console.log("executing after 3")
    await recursicRead(path, list);
    
    // list.map(async (obj)=>{
    //     await insertSong(obj);
    // })
    for(i=0;i<list.length;i++){
        await insertSong(list[i])
    }
    console.log("LIST LENGTH : ", list.length);
    // let data = await db.get("select * from songs");
    // console.log(list)

}, 3000);

