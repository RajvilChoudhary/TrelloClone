const router = require('express').Router();
const c = require('../controllers/attachmentController');
router.delete('/:id', c.deleteAttachment);
module.exports = router;
