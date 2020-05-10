const { LiqCon, Resolver } = require("../Utils")
const { DA_Track, DA_DedicateList } = require("../DataAccess")

async function getCurrentTrackId(){
    let current_track_liq_id;
    try{
        let onAir = await LiqCon.executeCommand('request.on_air')

        let ids = Resolver.resolveIdsStr(onAir[0])
        console.log(ids)
        // if(ids[0] == 0 && ids.length == 1){
        //     console.log("0 && length 1 = 0")
        //     current_track_liq_id = 0
        // }else 
        if(ids[0] == 0 && ids.length != 1){
            console.log("0 && length > 1 = second")
            current_track_liq_id = ids[1]
        }else{
            console.log(" ids [0] ")
            current_track_liq_id = ids[0]            
        }
        
        return current_track_liq_id

    }catch(err){
        console.log("getCurrentTrackId Err : ", err)
        throw(err)
    }
}

async function emitMessageForCurrentTrack(track_path){
    try{
        let message = undefined
        
        if(!track_path){
            throw("Track Path not found")
        }

        let result = await DA_Track.getTrackMessageFromTrackPath(track_path)            

        if( result.length > 0 && !result[0].dedicator_message == null){
            message.content = result[0].dedicator_message
            message.name = result[0].dedicator_name
            message.isDedicated = true
        }
        if(message){
            io.sockets.emit('message', message)
        }
        
        return message
    }catch(err){
        console.log('emitMessage Err : ',err)
        throw(err);
    }
}

async function getAndSetCurrentTrackInfo(computeAll=true){
    try{    
        console.log({ computeAll })
        let { lastTrackInfo, currentTrackInfo, nextTrackInfo, currentTrackRemainingInMilli, currentTrackMessage  } = CURRENT_TRACK_INFO
        if(computeAll){
            let obj = await getCurrentTrackInfo()
            
            // getting all info for previous, current, next track
            lastTrackInfo = obj.lastTrackInfo
            currentTrackInfo = obj.currentTrackInfo
            nextTrackInfo = await getNextTrack()
            currentTrackRemainingInMilli = await getCurrentTrackRemainingTimeInMilliSeconds()

            // emit messages for the respective song
            currentTrackMessage = await emitMessageForCurrentTrack(currentTrackInfo.path)

            DA_DedicateList.updateAiredStatus(currentTrackInfo.path)

            currentTrackInfo.path = undefined        
            
            setTimeout(() => {
                console.log("timeout triggered")
                getAndSetCurrentTrackInfo();
            }, currentTrackRemainingInMilli);

            CURRENT_TRACK_INFO = { lastTrackInfo, currentTrackInfo, nextTrackInfo, currentTrackRemainingInMilli, currentTrackMessage }

            console.log("Emmiting trackinfo")
            io.sockets.emit('trackinfo', CURRENT_TRACK_INFO);
        }

        currentTrackRemainingInMilli = await getCurrentTrackRemainingTimeInMilliSeconds()
        
        CURRENT_TRACK_INFO = { lastTrackInfo, currentTrackInfo, nextTrackInfo, currentTrackRemainingInMilli  }    
    }catch(err){
        console.log('getAndSetCurrentTrackInfo Err : ',err)
        throw(err);
    }
}

async function getTrackInfoById(track_liq_id){
    try{
        let trackInfo = await LiqCon.executeCommand(`request.metadata ${track_liq_id}`)
        let obj = Resolver.resolveTrackInfo(trackInfo)
        obj = {
            title: Resolver.resolveTrackname(obj.title),
            album: obj.album,
            year: obj.year ? obj.year : obj.date,
            composer: obj.composer,
            artist: obj.artist
        }
        return obj
    }catch(err){
        console.log("getTrackInfo Err : ", err)
        throw(err)
    }
}

async function getCurrentTrackInfo(){
    try{
        let allInfo = await LiqCon.executeCommand('GetNostalgic_Radio.metadata')        
        let lastTrackStartIndex = allInfo.indexOf("--- 2 ---");
        let lastTrackEndIndex = allInfo.indexOf("--- 1 ---");
        let lastTrack = Resolver.resolveTrackInfo(allInfo.slice(lastTrackStartIndex+1, lastTrackEndIndex))
        let currentTrack = Resolver.resolveTrackInfo(allInfo.slice(lastTrackEndIndex+1))
        let lastTrackInfo = {
            title: Resolver.resolveTrackname(lastTrack.title),
            album: lastTrack.album,
            year: lastTrack.year ? lastTrack.year : lastTrack.date,
            composer: lastTrack.composer,
            artist: lastTrack.artist            
        }
        let currentTrackInfo = {
            title: Resolver.resolveTrackname(currentTrack.title),
            album: currentTrack.album,
            year: currentTrack.year ? currentTrack.year : currentTrack.date,
            composer: currentTrack.composer,
            artist: currentTrack.artist,
            path: currentTrack.initial_uri
        }
        return { lastTrackInfo, currentTrackInfo }
    }catch(err){
        console.log("getCurrentTrackInfo Err : ", err)
        throw(err);
    }
}

async function getNextTrack(){
    try{    
        let count = await LiqCon.executeCommand("user_playlist.pending_length") // ["0"]
        count = parseInt(count[0]) == 0 ? true : false
        let next;
        if(count){
            /** when user_playlist is empty */
            next = await LiqCon.executeCommand("tamil.next") // ["[palying]", "", ""]
            console.log(next)
            next = Resolver.resolveTrackNameFromTrackPath(next[1])
            next = { title: Resolver.resolveTrackname(next) }
        }else{
            /** when user_playlist is not empty */
            let ids = await LiqCon.executeCommand("user_playlist.secondary_queue")
            ids = Resolver.resolveIdsStr(ids)

            next = await getTrackInfoById(ids[0])            
        }

        return next
    }catch(err){
        console.log("getNextTrack Err : ", err)
        throw(err);
    }
}

async function getCurrentTrackRemainingTimeInMilliSeconds(){
    try{
        let remainingTime = await LiqCon.executeCommand('GetNostalgic_Radio.remaining')
        return parseFloat(remainingTime)*1000
    }catch(err){
        console.log("getCurrentTrackRemainingTime Err : ", err)
        throw(err)
    }
}

async function searchTrack(query, limit){
    try{
        let result = await DA_Track.searchTrack(query, limit)
        return result
    }catch(err){
        console.log("searchTrack Err : ", err)
        throw(err)
    }
}

async function getTrack(offset, limit){
    try{
        let result = await DA_Track.getTrack(offset, limit)
        return result
    }catch(err){
        console.log("getTrackList Err : ", err)
        throw(err)
    }
}

module.exports = {
    getCurrentTrackId,
    getAndSetCurrentTrackInfo,
    getTrackInfoById,
    getCurrentTrackInfo,
    getNextTrack,
    getCurrentTrackRemainingTimeInMilliSeconds,
    searchTrack,
    getTrack
}