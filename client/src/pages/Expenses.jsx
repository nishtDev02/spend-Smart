import React from "react";
import { useState, useEffect } from "react";
import API from "../utils/axios";
import { PlusCircle, Trash2, Pencil, X, Check, Receipt } from "lucide-react";

const categoryColors = {
  food: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  shppping: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  groceries: "bg-green-500/10 text-green-400 border-green-500/20",
  transport: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  bill: "bg-red-500/10 text-red-400 border-red-500/20",
  health: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  education: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const categoryEmojis = {
  food: "🍔",
  shppping: "🛍️",
  groceries: "🛒",
  transport: "🚗",
  entertainment: "🎬",
  bill: "📄",
  health: "💊",
  education: "📚",
  other: "💰",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    category: "food",
    description: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchExpenses() }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if(editId) {
        await API.put(`/expenses/${editId}`, formData)
      } else {
        await API.post('/expenses', formData)
      }
      setFormData({ amount: '', category: 'food', description: '', date: '' })
      setShowForm(false)
      setEditId(null)
      fetchExpenses();
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  };

  const handleEdit = (expense) => {
    setEditId(expense._id);
    setFormData({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date?.split('T')[0] || ''
    })
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}`)
      fetchExpenses();
    } catch (error) {
      console.error(error)
    }
  };

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // category wise total
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  )[0];
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total: <span className="text-red-400 font-semibold">₹{totalExpense.toLocaleString()}</span>
            {topCategory && (
              <span className="ml-2 text-gray-500">
                • Most spent on <span className="text-white capitalize">{topCategory[0]}</span>
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({
              amount: "",
              category: "food",
              description: "",
              date: "",
            });
          }}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <PlusCircle size={18} />
          Add Expense
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">{editId ? "Edit Expense" : "Add Expense"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="5000"
                required
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                {Object.keys(categoryColors).map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryEmojis[cat]}{" "}
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Grocery shopping at DMart..."
                required
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
                <Check size={16} />
                {submitting ? "Saving" : editId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                }}
                className="flex items-center gap-2 border border-white/10 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* category summary */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amt]) => (
              <div key={cat} className={`p-3 rounded-xl border ${categoryColors[cat]}`}>
                <div className="text-lg mb-1">{categoryEmojis[cat]}</div>
                <div className="font-semibold text-sm">₹{amt.toLocaleString()}</div>
                <div className="text-xs capitalize opacity-70">{cat}</div>
              </div>
            ))}
        </div>
      )}

      {/* Expense list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-20">
          <Receipt size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No expenses added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense._id} className="flex items-center justify-between bg-gray-900 border border-white/5 rounded-2xl p-5 hover:border-red-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl">{categoryEmojis[expense.category]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">₹{expense.amount.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${categoryColors[expense.category]}`}>{expense.category}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">{expense.description}</p>
                  <p className="text-gray-600 text-xs">
                    {expense.date
                      ? new Date(expense.date).toLocaleDateString()
                      : new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(expense)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(expense._id)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
