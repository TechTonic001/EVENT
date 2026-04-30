const express = require('express');
const requireAuth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

const router = express.Router();

router.get('/stats', requireAuth, eventController.getStats);
router.get('/', requireAuth, eventController.getEvents);
router.post('/', requireAuth, eventController.createEvent);

module.exports = router;

