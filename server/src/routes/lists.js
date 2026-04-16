const router = require('express').Router();
const c = require('../controllers/listController');
router.post('/',             c.createList);
router.put('/:id',           c.updateList);
router.put('/:id/reorder',   c.reorderList);
router.delete('/:id',        c.deleteList);
module.exports = router;
