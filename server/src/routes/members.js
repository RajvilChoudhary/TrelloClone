const router = require('express').Router();
const c = require('../controllers/memberController');
router.get('/', c.getAllMembers);
module.exports = router;
