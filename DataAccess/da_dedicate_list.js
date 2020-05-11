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

async function getTrackInfoWithTrackID(track_id){
    try{
        if(!track_id){
            throw("Track ID not present")
        }
        
        let sql = `select * from tracks as t
                   left join dedicatelist as dl on t.track_id=dl.track_id
                   where t.track_id = ${track_id}`;
        let result = await db.get(sql);
        return result
    }catch(err){
        console.log('checkTack Err : ',err)
        throw(err);
    }
}

async function updateAiredStatus(dl_id){
    try{
        console.log("updating aired status for dl_id : ", dl_id)
        let sql = `update dedicatelist set aired_status=true where dl_id=${dl_id}`
        db.run(sql)
    }catch(err){
        console.log('updateAiredStatus Err : ',err)
        throw(err);
    }
}

module.exports = {
    create,
    getTrackInfoWithTrackID,
    updateAiredStatus
}