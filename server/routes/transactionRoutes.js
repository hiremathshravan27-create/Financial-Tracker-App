const express = require('express');
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Secure all transaction routes with JWT protect middleware
router.route('/').get(protect, getTransactions).post(protect, addTransaction);
router.route('/:id').delete(protect, deleteTransaction);

module.exports = router;