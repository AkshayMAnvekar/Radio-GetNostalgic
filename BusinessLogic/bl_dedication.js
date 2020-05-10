const { LiqCon, Resolver } = require("../Utils")
const { DA_DedicateList, DA_DedicateMessage } = require('../DataAccess')

async function addTrack(trackObj, msgObj){
    try{
        // TODO push trackk to liq            
        let liq_id = await LiqCon.execute(`user_playlist.push ${trackObj.track_path}`)
        liq_id = parseInt(liq_id[0])

        // TODO add track to dedicatelist
        let dedicate_list_id = await DA_DedicateList.create(trackObj.track_id, liq_id)

        //TODO add message to db 
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