const router = require('express').Router();
const c = require('../controllers/labelController');
router.put('/:id',    c.updateLabel);
router.delete('/:id', c.deleteLabel);
module.exports = router;
