const router = require('express').Router();
const c = require('../controllers/checklistController');
router.delete('/:id',         c.deleteChecklist);
router.post('/:id/items',     c.addItem);
module.exports = router;
