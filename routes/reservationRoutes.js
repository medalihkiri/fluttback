const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/', auth, reservationController.createReservation);
router.get('/me', auth, reservationController.getMyReservations);
router.delete('/:id', auth, reservationController.returnBook);

module.exports = router;
