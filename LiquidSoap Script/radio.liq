#!/usr/bin/liquidsoap

set("server.telnet", true)

# safe
safe = single("/path/to/file")

# user playlist
user_list = request.equeue(id="user_playlist")

# tracks make sure that the path ends with tamil or edit the backend code in BusinessLogic/bl_tracks.js {end foldername}.next
tracks = playlist(mode='randomize', reload=3600, reload_mode="watch", "/path/to/folder")

# jingles
jingles = playlist(mode='randomize', reload=3600, reload_mode="watch", "/path/to/jingles/folder")

# rotate
rotation = rotate(weights=[1,10],[jingles,tracks])

# radio
radio = fallback(track_sensitive = false, [user_list, rotation, safe])


output.icecast(
        %mp3,
        host="localhost",
        port=8000,
        password="program",
        mount="tamil",
        url="https://getnostalgic.com/radio",
        description="This is a web radio which plays tamil songs only - GetNostalgic Radio",
        name="GetNostalgic Radio",
        genre="Radio",
        radio)