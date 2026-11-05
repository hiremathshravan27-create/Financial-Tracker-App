const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory array to store transactions temporarily for development
let transactions = [];

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Registration received:', { name, email });
  
  res.status(201).json({ 
    success: true, 
    message: 'User registered successfully!', 
    token: 'mock-jwt-token-123' 
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login received:', { email });
  
  res.status(200).json({ 
    success: true, 
    message: 'Logged in successfully!', 
    token: 'mock-jwt-token-123' 
  });
});

// --- TRANSACTION ROUTES ---

// Get all transactions
app.get('/api/transactions', (req, res) => {
  res.status(200).json(transactions);
});

// Add a new transaction
app.post('/api/transactions', (req, res) => {
  const { description, amount, category, type, title } = req.body;
  
  const newTransaction = {
    id: Date.now().toString(),
    title: title || description || 'Untitled',
    amount: Number(amount),
    category: category || 'General',
    type: type || 'income',
    date: new Date()
  };

  transactions.push(newTransaction);
  console.log('Transaction added:', newTransaction);
  
  res.status(201).json(newTransaction);
});

// Delete a transaction by ID
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = transactions.length;
  
  // Filter out the transaction matching either _id or id
  transactions = transactions.filter(t => (t._id || t.id) !== id);
  
  if (transactions.length < initialLength) {
    console.log('Transaction deleted:', id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
  } else {
    res.status(404).json({ success: false, message: 'Transaction not found' });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Personal Finance Tracker API is running!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});