const router   = require('express').Router();
const c        = require('../controllers/cardController');
const cc       = require('../controllers/commentController');
const chc      = require('../controllers/checklistController');
const multer   = require('multer');
const path     = require('path');
const { v4: uuidv4 } = require('uuid');
const ac       = require('../controllers/attachmentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename:    (req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.post('/',             c.createCard);
router.get('/:id',           c.getCardById);
router.put('/:id',           c.updateCard);
router.put('/:id/move',      c.moveCard);
router.delete('/:id',        c.deleteCard);

// Labels
router.post('/:id/labels',           c.addLabel);
router.delete('/:id/labels/:labelId',c.removeLabel);

// Members
router.post('/:id/members',            c.addMember);
router.delete('/:id/members/:userId',  c.removeMember);

// Checklists
router.post('/:id/checklists', chc.createChecklist);

// Comments + Activity
router.get('/:id/comments',  cc.getComments);
router.post('/:id/comments', cc.addComment);
router.get('/:id/activity',  cc.getActivity);

// Attachments
router.post('/:id/attachments', upload.single('file'), ac.uploadAttachment);

module.exports = router;
