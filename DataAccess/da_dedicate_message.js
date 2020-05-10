const db = require("../Components").DatabaseService.conPromise

async function create(dedicate_list_id, msgObj){
    try{
        let sql = "insert into dedicatemessage(dedicatelist_id, dedicator_message, dedicator_name) values(?,?,?)";
        let params = [dedicate_list_id, msgObj.content, msgObj.name]

        let dedicate_message_id = await db.run(sql, params)
        return dedicate_message_id
    }catch(err){
        console.log('create Err : ',err)
        throw(err);
    }
}

async function createWithoutDedicateListId(msgObj){
    try{
        let sql = "insert into dedicatemessage(dedicator_message, dedicator_name) values(?,?)";
        let params = [msgObj.content, msgObj.name]

        let dedicate_message_id = await db.run(sql, params)
        return dedicate_message_id
    }catch(err){
        console.log('create Err : ',err)
        throw(err);
    }
}

module.exports = {
    create,
    createWithoutDedicateListId
}