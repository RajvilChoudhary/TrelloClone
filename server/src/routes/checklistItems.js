const router = require('express').Router();
const c = require('../controllers/checklistController');
router.put('/:id',    c.updateItem);
router.delete('/:id', c.deleteItem);
module.exports = router;
