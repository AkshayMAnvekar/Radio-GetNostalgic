const { LiqCon, Resolver } = require("../Utils")
const { DA_DedicateList, DA_DedicateMessage } = require('../DataAccess')

async function addTrack(trackObj, msgObj){
    try{
        // push trackk to liq            
        let liq_id = await LiqCon.executeCommand(`user_playlist.push ${trackObj.track_path}`)
        console.log({liq_id})
        liq_id = parseInt(liq_id[0])

        // add track to dedicatelist
        let dedicate_list_id = await DA_DedicateList.create(trackObj.track_id, liq_id)

        // add message to db 
        let dedicate_message_id = undefined
        if(msgObj && msgObj.content){
            dedicate_message_id = await DA_DedicateMessage.create(dedicate_list_id, msgObj)
        }

        return { dl_id: dedicate_list_id, msg_id: dedicate_message_id }
    }catch(err){
        console.log('addTrack Err : ',err)
        throw(err);
    }
}

async function checkTrackPlayed(track_id){
    try{
        if(!track_id){
            throw("Track Id is undefined actualValue : ", track_id)
        }
        let result = await DA_DedicateList.getTrackInfoWithTrackID(track_id)

        let pastHour = new Date().getTime() - 3600000

        console.log("Last hour song check : ", result)

        if(result && result[0].dl_id){
            if(result[0].timestamp >= pastHour){
                return { status: true }
            }
        }

        return { status: false, track_path: result[0].track_path }
    }catch(err){
        console.log('checkTrackPlayed Err : ',err)
        throw(err);
    }
}

module.exports = {
    addTrack,
    checkTrackPlayed
}