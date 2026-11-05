import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';
import FinanceAnalytics from '../components/FinanceAnalytics';
import axios from 'axios';
import { Trash2, ArrowUpRight, ArrowDownRight, Wallet, Activity, Search, Download, Filter, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Monthly Budget Cap State (persisted in localStorage)
  const [monthlyBudget, setMonthlyBudget] = useState(
    Number(localStorage.getItem('monthlyBudget')) || 2000
  );
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  const fetchTransactions = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const res = await axios.get('http://localhost:5000/api/transactions', config);
      setTransactions(res.data);
    } catch (err) {
      toast.error('Failed to fetch transactions');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, config);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  // Derived Summary Totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Budget Percentage Calculation
  const budgetPercentage = Math.min(Math.round((totalExpense / (monthlyBudget || 1)) * 100), 100);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const newBudget = Number(tempBudget);
    if (newBudget > 0) {
      setMonthlyBudget(newBudget);
      localStorage.setItem('monthlyBudget', newBudget);
      setIsEditingBudget(false);
      toast.success('Budget cap updated!');
    }
  };

  // Categories for Filter Dropdown
  const categories = ['all', ...new Set(transactions.map((t) => t.category).filter(Boolean))];

  // Filtered Transactions List (Safeguarded against undefined properties)
  const filteredTransactions = transactions.filter((t) => {
    const titleText = (t.title || t.description || '').toLowerCase();
    const searchTermText = (searchTerm || '').toLowerCase();
    
    const matchesSearch = titleText.includes(searchTermText);
    const matchesType = selectedType === 'all' || t.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Title,Amount,Type,Category,Date\n'];
    const rows = filteredTransactions.map((t) =>
      `"${t.title || t.description || ''}",${t.amount},${t.type},"${t.category || 'General'}","${new Date(t.date).toLocaleDateString()}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `finance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
    toast.success('CSV Report Downloaded!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Metric Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/50 p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Balance</p>
                <h2 className={`text-3xl font-black ${balance < 0 ? 'text-rose-400' : 'text-white'}`}>
                  ${balance.toFixed(2)}
                </h2>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Income</p>
              <h2 className="text-2xl font-bold text-emerald-400">+${totalIncome.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Expenses</p>
              <h2 className="text-2xl font-bold text-rose-400">-${totalExpense.toFixed(2)}</h2>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <ArrowDownRight className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Budget Spending Target Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">Monthly Budget Cap</h4>
                <p className="text-xs text-slate-400">
                  Spent ${totalExpense.toFixed(2)} of ${monthlyBudget.toFixed(2)} Limit
                </p>
              </div>
            </div>

            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-24 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-2.5 py-1 text-xs outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1 rounded-lg transition"
                >
                  Save
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingBudget(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline self-start sm:self-auto cursor-pointer"
              >
                Edit Target Cap
              </button>
            )}
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalExpense > monthlyBudget
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400 font-medium">
            <span>{budgetPercentage}% Budget Used</span>
            <span>
              {totalExpense > monthlyBudget
                ? 'Warning: Budget Exceeded!'
                : `$${(monthlyBudget - totalExpense).toFixed(2)} Remaining`}
            </span>
          </div>
        </div>

        {/* Main Application Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Analytics Charts */}
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm user={user} onTransactionAdded={fetchTransactions} />
            <FinanceAnalytics transactions={transactions} />
          </div>

          {/* Right Column: Activity History, Filters & CSV Export */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-400" />
                  Activity History
                </h3>

                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Filters & Search Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="relative">
                  <Search className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 outline-none w-full"
                  >
                    <option value="all" className="bg-slate-900">All Types</option>
                    <option value="income" className="bg-slate-900">Income Only</option>
                    <option value="expense" className="bg-slate-900">Expenses Only</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 outline-none w-full capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 capitalize">
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transaction Item List */}
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-slate-500 text-sm">No matching transactions found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((t) => (
                    <div
                      key={t._id || t.id}
                      className="flex items-center justify-between p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl transition duration-200"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            t.type === 'income'
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}
                        >
                          {t.type === 'income' ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-200">{t.title || t.description}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            <span className="text-slate-400">{t.category}</span> •{' '}
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span
                          className={`font-extrabold text-sm ${
                            t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteTransaction(t._id || t.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}