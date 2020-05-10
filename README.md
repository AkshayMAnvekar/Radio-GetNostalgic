# Radio-GetNostalgic
Web Radio using Liquidsoap and NodeJS ( only backend )
# Features:
- Dedicate or Request Song with or without a message
- Swagger (OpenAPI: 3.0.0) API Documentation. go to route /api-doc
- Realtime updates of next current & next track information

# Pre-requisites 
- Icecast2 - streaming server
- Liquidsoap - Scripting language for audio & video streaming
- NodeJS

# To Run the project
- $~/liquidsoap radio.liq ( specify the correct folderpath and setting in .liq file )
- edit the ./config.js file appropriately. It uses sqlite3 as database. DB_PATH, TRACK_PATH is where your tracks are located. Note: all the path relates to directory not a file. 
- .sqlite file will be created in DB_PATH if it doesnot exists
- $~/ npm install 
- $~/ node recursive.js // to add all tracks into sqlite database
- $~/ node app.js


# Project Notes
- Socket-IO used
- for API doc go to /api-doc
