const Transaction = require('../models/Transaction');

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
  const { title, amount, type, category, date } = req.body;

  try {
    if (!title || !amount || !type || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};