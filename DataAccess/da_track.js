const { DatabaseService } = require("../Components")

let db = DatabaseService.conPromise

async function searchTrack(str, limit){
    try{
        let sql = `select track_id, track_title from tracks where track_title like "${str}%" limit ${limit}`        
        let result1 = await db.get(sql)

        if(!result1.length < limit){
            limit = limit - result1.length
            sql = `select track_id, track_title from tracks where track_title like "%${str}%" limit ${limit}`
            let result2 = await db.get(sql)
            let set = new Set(result1.concat(result2))
            result1 = [...set]
        }

        return result1
    }catch(err){
        console.log("DA searchTrack Err : ", err)
        throw(err)
    }
}

async function getTrack(offset, limit){
    try{
        let sql = `select track_id, track_title from tracks limit ${limit} offset ${offset}`        
        let result = await db.get(sql)        

        return result
    }catch(err){
        console.log("DA searchTrack Err : ", err)
        throw(err)
    }
}

async function getTrackMessageFromTrackPath(track_path){
    try{
        let sql =  `select dl_id, dedicator_message, dedicator_name from tracks as t
                    inner join dedicatelist as dl on t.track_id=dl.track_id
                    left join dedicatemessage as dm on dl.dl_id=dm.dmsg_id
                    where t.track_path="${track_path}" and dl.aired_status=false
                    order by dl.timestamp desc limit 1`;
        let result = await db.get(sql)
        return result
    }catch(err){
        console.log('getTrackMessageFromTrackPath Err : ',err)
        throw(err);
    }
}

module.exports = {
    searchTrack,
    getTrack,
    getTrackMessageFromTrackPath
}