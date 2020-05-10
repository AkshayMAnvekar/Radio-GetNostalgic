const Express = require("express")
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {        
        openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
        info: {
            title: "Radio-GetNostalgic",
            description: "API's for Radio-GetNostalgic",
            version: "1.0.0",            
            contact: {
                "name": "API Support",
                "url": "https://getnostalgic.com",
                "email": "getnostalgiccare@gmail.com"
            },
            
        },  
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Testing Server"
            },
            {
                url: "https://radio.getnostalgic.com:8081/api/v1",
                description: "Production Server"
            },
        ],
        tags: [
            {
                name: "api",
                description: "This tag is used to represent API"
            },
            {
                name: "event",
                description: "This tag is used to represent events emitted by the server"
            }
        ]

    },
    // Path to the API docs
    apis: ['app.js','./Routes/v1/*.js', './Sockets/events.js']
};

let swaggerDocs = swaggerJsDoc(options);

// Routes Import
const uploadRoute = require("./Mp3Upload/mp3upload")
const routes = require("./Routes")

const app = Express();

var http = require('http').createServer(app);

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/swagger.json", (req, res)=>{
    res.json(swaggerDocs);    
})

// Routes
app.use(uploadRoute)
app.use("/api",routes)

global.io = require('socket.io')(http);
global.CURRENT_TRACK_INFO = {}
global.CURRENT_TRACK_REMAINING_TIME_IN_MILLI = 0;

require("./Sockets/events")

http.listen(3000, () => {
  console.log('listening on *:3000');
});


/**
 *@swagger
 *components:
 *  schemas:
 *    TrackMax:
 *      description: You cannot expect all the keys sometime only key you may get is title   
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          example: Vande Mataram
 *        album:
 *          type: string
 *          example: ABCD 2
 *        year:
 *          type: string
 *          example: 2015
 *        composer:
 *          type: string
 *          example: Sachin Jigar
 *        artist:
 *          type: string
 *          example: Daler Mehndi, Tanishka Sanghvi, Badshah & Divya Kumar
 *    TrackMin: 
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          example: Vande Mataram
 *    TrackList: 
 *      type: object
 *      properties:
 *        track_title:
 *          type: string
 *          example: Vande Mataram
 *        track_id:
 *          type: integer
 *          example: 1192
 *  response_errors:
 *    400: 
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          example: "Invalid input error"
 *    409: 
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          example: "Duplication error code track already in user_playlist"
 *    500: 
 *      type: object
 *      properties:
 *        error:
 *          type: string
 *          example: "Internal server error"
 *        actualErr:
 *          type: string
 *          example: "some error text"
 *
 *
 *
*/
