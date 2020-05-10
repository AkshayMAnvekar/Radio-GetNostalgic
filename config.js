const os = require('os')
let system = os.platform() === 'win32' ? "pc" : "pi"

const obj = {
    "pc": {
        "TRACKS_PATH": "E:/Songs/Tamil Songs",
        "DB_PATH": "",
        "SERVER_URL": "http://localhost:3000"
    },
    "pi": {
        "TRACKS_PATH": "/media/usb/music/tamil",
        "DB_PATH": "/media/usb",
        "SERVER_URL": "http://localhost:3000"
    }
}

module.exports = obj[system] 