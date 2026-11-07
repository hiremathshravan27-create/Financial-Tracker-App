import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionForm({ onTransactionAdded, user }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(
        'https://financial-tracker-app-ypkt.onrender.com/api/transactions',
        { title, amount: Number(amount), type, category },
        config
      );
      toast.success('Transaction logged!');
      setTitle('');
      setAmount('');
      onTransactionAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl mb-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <PlusCircle className="h-4 w-4 text-indigo-400" />
          New Transaction
        </h3>
        
        {/* Type Switcher Buttons */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="h-3.5 w-3.5" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Income
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
          <input
            type="text"
            placeholder="e.g. Netflix Subscription, Grocery shopping"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount ($)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <input
              type="text"
              placeholder="e.g. Food, Salary, Tech"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 text-sm cursor-pointer"
      >
        Save Transaction
      </button>
    </form>
  );
}