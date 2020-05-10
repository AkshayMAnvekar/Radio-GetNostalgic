const db = require("../Components").DatabaseService.conPromise

async function create(track_id, liq_id){
    try{
        if(!track_id){
            throw("Track ID not present")
        }
        
        let sql = 'insert into dedicatelist(track_id, liq_id, timestamp)values(?,?,?)';
        let params = [track_id, liq_id, new Date().getTime()]

        let dl_id = db.run(sql, params)
        return dl_id        
    }catch(err){
        console.log('create Err : ',err)
        throw(err);
    }
}

async function checkTrackWithInLastHour(track_id){
    try{
        if(!track_id){
            throw("Track ID not present")
        }
        
        let current = new Date().getTime()
        let pastHour = current - 3600000
        let sql = `select * from dedicatelist as dl
                   left join tracks as t on dl.track_id=t.track_id
                   where dl.track_id = ${track_id} and dl.timestamp >= ${pastHour}`;
        let result = await db.get(sql);
        if(!result.length > 0){
            return { status: true }
        }
        let { track_path, track_title } = result[0]
        return { status:false, track_path, track_title }
    }catch(err){
        console.log('checkTack Err : ',err)
        throw(err);
    }
}

async function updateAiredStatus(dl_id){
    try{
        let sql = `update dedicatelist set aired_status=true where dl_id=${dl_id}`
        db.run(sql)
    }catch(err){
        console.log('updateAiredStatus Err : ',err)
        throw(err);
    }
}

module.exports = {
    create,
    checkTrackWithInLastHour,
    updateAiredStatus
}