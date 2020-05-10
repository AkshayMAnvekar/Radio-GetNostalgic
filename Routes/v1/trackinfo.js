const router = require("express").Router()

const { Track } = require("../../BusinessLogic")

/**
 * @swagger
 *
 * /track/current:
 *   get:
 *     tags: ["api"]
 *     summary: Get Current Track Info
 *     consumes:
 *       - application/json 
 *     produces:
 *       - application/json   
 *     responses:
 *       400:
 *         description: "Invalid input error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/400'
 *       409:
 *         description: "Duplication error in server"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/409'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/500'
 *       200:
 *         description: "Getting the current track info"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 lastTrackInfo:
 *                   $ref: '#/components/schemas/TrackMax'
 *                 currentTrackInfo:
 *                   $ref: '#/components/schemas/TrackMax' 
 *                 nextTrackInfo:
 *                   $ref: '#/components/schemas/TrackMin'
 *                 currentTrackRemainingInMilli:
 *                   type: integer
 *                   example: 123456
 */
router.get("/current",async (req, res)=>{    
    try{
        if(CURRENT_TRACK_INFO.currentTrackInfo){
            await Track.getAndSetCurrentTrackInfo(false);
        }else{
            await Track.getAndSetCurrentTrackInfo();
        }
        res.status(200).json(CURRENT_TRACK_INFO);
    }catch(err){
        res.status(500).json({error: "Internal Server Error", actualErr: err})
    }
})

/**
 * @swagger
 *
 * /track/search:
 *   get:
 *     tags: ["api"]
 *     summary: Search Track to dedicate with message or reuest to play
 *     consumes:
 *       - application/json 
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: query
 *       required: true
 *       type: string
 *       example: priyamaanavalae
 *       description: The query typed by the user in search bar
 *     - in: query
 *       name: limit
 *       type: integer
 *       example: 5
 *       description: The no of result you want defaults to 5
 *     responses:
 *       400:
 *         description: "Invalid input error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/500'
 *       200:
 *         description: Return array of objects with track_id and title
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 tracks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrackList' 
 *                 query:
 *                   type: string
 *                   example: va
 *                 limit:
 *                   type: integer
 *                   example: 5
 */
router.get("/search", async (req, res)=>{
    let query = req.query.query
    let limit = req.query.limit ? req.query.limit : 5
    try{
        if(!query){
            res.status(400).json({ error: "Send Search Query to search" })
            return
        }
        if(isNaN(limit)){
            res.status(400).json({ error: "Limit can contain only number" })
            return
        }
        
        let result = await Track.searchTrack(query, limit)
        console.log(result.length)
        res.status(200).json({ tracks: result, query, limit })
    }catch(err){
        res.status(500).json({ error: err })
    }
})

/**
 * @swagger
 *
 * /track/list:
 *   get:
 *     tags: ["api"]
 *     summary: Get list of song to display
 *     consumes:
 *       - application/json 
 *     produces:
 *       - application/json
 *     parameters:
 *     - in: query
 *       name: offset
 *       schema:
 *         type: integer
 *         default: 0
 *       description: If not specified it is always set to 0
 *       example: 40
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 20
 *       description: If not specified it defaults to  20
 *       example: 20        
 *     responses:
 *       400:
 *         description: "Invalid input error"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/response_errors/500'
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 tracks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrackList' 
 *                 offset:
 *                   type: integer
 *                   example: 40
 *                 limit:
 *                   type: integer
 *                   example: 5
 */
router.get("/list", async (req, res)=>{
    let offset = req.query.offset ? req.query.offset : 0
    let limit = req.query.limit ? req.query.limit : 20
    try{        
        if(isNaN(offset)){
            res.status(400).json({ error: "Offset should be a number" })
            return
        }
        if(isNaN(limit)){
            res.status(400).json({ error: "limit should be a number" })
            return
        }
        let result = await Track.getTrack(offset, limit)
        res.status(200).json({tracks: result, limit, offset})
    }catch(err){
        res.status(500).json({ error: err })
    }

})

module.exports = router