const router = require("express").Router()

const trackInfo = require("./trackinfo")
const dedicate = require("./dedicate")

router.use("/track",trackInfo)
router.use("/dedicate", dedicate)


router.get("/", (req, res)=>{
    res.json({ data: "v1 works" })
})

module.exports = router;