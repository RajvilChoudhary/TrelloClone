const router = require('express').Router();
const c = require('../controllers/commentController');
router.delete('/:id', c.deleteComment);
module.exports = router;
