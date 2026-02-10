const express = require("express");
const bodyParser = require('body-parser');
const betController = require('./controllers/BetController')

const router = express.Router()



//parsing form data successfully
router.use(express.json({limit: '50mb'})) // for parsing application/json
router.use(express.urlencoded({ limit: '50mb',extended: true})) // for parsing application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));



router.get('/',(req,res)=> {
    res.send('Backend online now')
})


router.get('/football-events', betController.test);
//bet routes

module.exports = router;



 