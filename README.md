# Radio-GetNostalgic
Web Radio using Liquidsoap and NodeJS ( only backend )

# Pre-requisites 
- Icecast2 - streaming server
- Liquidsoap - Scripting language for audio & video streaming
- NodeJS

# To Run the project
- $~/liquidsoap radio.liq ( specify the correct folderpath and setting in .liq file )
- edit the ./config.js file appropriately. DB_PATH it uses sqlite3, TRACK_PATH is where your tracks are located. Note: all the path relates to directory not a file
- $~/ npm install 
- $~/ node app.js
