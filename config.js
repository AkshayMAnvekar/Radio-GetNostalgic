const os = require('os')
let system = os.platform() === 'win32' ? "pc" : "pi"

const obj = {
    "pc": {
        "TRACKS_PATH": "E:/Songs/Tamil Songs",
        "DB_PATH": ""
    },
    "pi": {
        "TRACKS_PATH": "/media/usb/music/tamil",
        "DB_PATH": "/media/usb/database"
    }
}

module.exports = obj[system] 