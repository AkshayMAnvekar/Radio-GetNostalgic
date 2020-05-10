io.on("connection", socket =>{
    // console.log(socket);
    let user_id = socket.handshake.query.user_id;
    console.log("Socket client connected ", user_id);
    
    socket.on("request", data =>{
        // push to user_playlist 
        console.log({data})
    })
})
console.log("EVENTS IMPORTED")

/**
 *@swagger
 * /event/trackinfo:
 *   get:
 *     tags: ["event"]
 *     summary: Explains the data given while emitting trackinfo event
 *     responses:
 *       200:
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
 *
 * /event/message:
 *   get:
 *     tags: ["event"]
 *     summary: Explains the data emitted for message event
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: string
 *                   minLength: 0
 *                   maxLength: 200
 *                   example: A sentence of about 200 characters Max 
 *                 name:
 *                   type: string
 *                   minLength: 0
 *                   maxLength: 50
 *                   example: your Name
 *                 isDedicated:
 *                   type: boolean
 *                   example: false
 */