function resolveTrackInfo(infos){
    try{
        let obj = {};
        
        infos.map( info =>{
            if(info.includes("=")){
                info = info.replace(/\"/g, "")
                info = info.split("=")
                obj[info[0]] = info[1]
            }
        })

        return obj

    }catch(err){
        console.log("resolveTrackInfo Err: ", err)
        throw(err)
    }
}

function resolveName(track_name){
    try{
        if(!track_name){
            return undefined
        }
        let hypenIndex = track_name.lastIndexOf("-");
        if(hypenIndex !== -1 && hypenIndex < 7){
            // then it is from the starting point
            track_name = track_name.substring(hypenIndex+1, track_name.length)
        }

        if(hypenIndex !== -1 && hypenIndex >= 7){
            // then it is from the end
            track_name = track_name.substring(0, hypenIndex)
        }
        
        track_name = track_name.trim().replace(/\_/g, " ")
        return track_name
    }catch(err){
        console.log('resolveName Err : ',err)
        throw(err);
    }
}

function resolveTrackNameFromTrackPath(trackUri){
    try{
        // to remove path and .mp3 from file name
        let startIndex = trackUri.lastIndexOf("/");
        // console.log({ trackUri, startIndex })
        startIndex = startIndex == -1 ? 0 : startIndex +1
        trackUri = trackUri.replace(/\.mp3/, "").replace(/\.MP3/, "")
        trackUri = trackUri.substring(startIndex, trackUri.length)

        // to remove hyphen and insert space instead of _
        trackUri = resolveName(trackUri)
        return trackUri
    }catch(err){
        console.log("resolveTrackNameFromTrackPath Err : ", err)
        throw(err)
    }
}

function resolveIdsStr(idsString){
    console.log({idsString})
    idsString = idsString.replace(/\r/g, "").replace(/\n/g, "")
    return idsString.trim().split(" ")
}

// UNIT TESTS
// console.log(resolveIds('"3 0"'))
// console.log(resolveName("/media/usb/music/tamil/Idhazhin_Oram-VmusiQ.Com.mp3"))

module.exports = {
    resolveTrackInfo,
    resolveIdsStr,
    resolveName,
    resolveTrackNameFromTrackPath
}