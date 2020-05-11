const { LiqCon, Resolver } = require("../Utils")
const { DA_Track, DA_DedicateList } = require("../DataAccess")

async function getMessageForCurrentTrack(track_path){
    try{
        let message = undefined
        
        if(!track_path){
            throw("Track Path not found")
        }

        let result = await DA_Track.getTrackMessageFromTrackPath(track_path)            
        console.log("trackMsg : ", result)
        if( result.length > 0 && result[0].dedicator_message !== null){
            // uncomment below line updating dedicate_list to specify that song has been played
            DA_DedicateList.updateAiredStatus(result[0].dl_id)
            
            // creating obj to emit and store in CURRENT_TRACK_INFO
            message = {
                content: result[0].dedicator_message,
                name: result[0].dedicator_name,
                displayTime: 20000,
                isDedicated: true
            }
        }
        
        return message
    }catch(err){
        console.log('getMessageForCurrentTrack Err : ',err)
        throw(err);
    }
}

async function getAndSetCurrentTrackInfo(computeAll=true){
    try{    
        console.log({ computeAll })
        let messageInfo = undefined;
        let { lastTrackInfo, currentTrackInfo, nextTrackInfo, currentTrackRemainingInMilli, currentTrackMessage  } = CURRENT_TRACK_INFO
        if(computeAll){
            let obj = await getCurrentTrackInfo()
            
            // getting all info for previous, current, next track
            lastTrackInfo = obj.lastTrackInfo
            currentTrackInfo = obj.currentTrackInfo
            nextTrackInfo = { title: await getNextTrack() }
            currentTrackRemainingInMilli = await getCurrentTrackRemainingTimeInMilliSeconds()

            // get messages for the respective song
            console.log(currentTrackInfo.path)            
            currentTrackMessage = await getMessageForCurrentTrack(currentTrackInfo.path)
            console.log({currentTrackMessage})

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
        console.log({ CURRENT_TRACK_INFO })
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
            title: Resolver.resolveName(obj.title),
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

        let lastTrackPath = lastTrack.initial_uri ? lastTrack.initial_uri : lastTrack.filename
        let lastTrackInfo = {
            title: Resolver.resolveTrackNameFromTrackPath(lastTrack.filename),
            album: Resolver.resolveName(lastTrack.album),
            year: lastTrack.year ? lastTrack.year : lastTrack.date,
            composer: Resolver.resolveName(lastTrack.composer),
            artist: Resolver.resolveName(lastTrack.artist)
        }
        
        let currentTrackPath = currentTrack.initial_uri ? currentTrack.initial_uri : currentTrack.filename
        let currentTrackInfo = {
            title: Resolver.resolveTrackNameFromTrackPath(currentTrack.filename),
            album: Resolver.resolveName(currentTrack.album),
            year: currentTrack.year ? currentTrack.year : currentTrack.date,
            composer: Resolver.resolveName(currentTrack.composer),
            artist: Resolver.resolveName(currentTrack.artist),
            path: currentTrack.initial_uri ? currentTrack.initial_uri : currentTrack.filename
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
            next = await LiqCon.executeCommand("tamil.next") // ["[palying / ready]", "", ""]

            if(next[0] && next[0].includes("[ready]")){
                // next song may be in jingles or user_playlist handle that
                console.log("next track in ready state ")
                let temp = next[0].replace("[ready]", "").trim()
                next = Resolver.resolveTrackNameFromTrackPath(temp)
            }else{
                next = Resolver.resolveTrackNameFromTrackPath(next[1])
            }            
        }else{
            /** when user_playlist is not empty */
            let ids = await LiqCon.executeCommand("user_playlist.secondary_queue")            
            ids = Resolver.resolveIdsStr(ids[0])

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
    getAndSetCurrentTrackInfo,
    getTrackInfoById,
    getCurrentTrackInfo,
    getNextTrack,
    getCurrentTrackRemainingTimeInMilliSeconds,
    searchTrack,
    getTrack
}