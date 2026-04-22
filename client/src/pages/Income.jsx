import React from "react";
import { useState, useEffect } from "react";
import API from "../utils/axios.js";
import {
  PlusCircle,
  Trash2,
  Pencil,
  X,
  Check,
  TrendingUp,
  Plus,
  Trash,
} from "lucide-react";

const sourceColors = {
  salary: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  freelance: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};
const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    source: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchIncomes() }, []);

  const fetchIncomes = async () => {
    try {
      const res = await API.get('/income');
      setIncomes(res.data);
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
      if (editId) {
        await API.put(`/income/${editId}`, formData)
      } else {
        await API.post('/income', formData);
      }
      setFormData( {amount: '', source: 'salary', date: ''} );
      setShowForm(false);
      setEditId(null);
      fetchIncomes();
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  };

  const handleEdit = (income) => {
    setEditId(income._id);
    setFormData({
      amount: income.amount,
      source: income.source,
      date: income.date?.split('T')[0] || ''
    })
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/income/${id}`)
      fetchIncomes();
    } catch (error) {
      console.error(error)
    }
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Income</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total:{" "}
            <span className="text-emerald-400 font-semibold">
              ₹{totalIncome.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({ amount: "", source: "salary", date: "" });
          }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <PlusCircle size={18} />
          Add Income
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">
            {editId ? "Edit Income" : "Add New Income"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Amount (₹)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="50000"
                required
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-gray-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="sm:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
              >
                <Check size={16} />
                {submitting ? "Saving..." : editId ? "Update" : "Save"}
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

      {/* Income list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : incomes.length === 0 ? (
        <div className="text-center py-20">
          <TrendingUp size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No income added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {incomes.map((income) => (
            <div
              key={income._id}
              className="flex items-center justify-between p-5 bg-gray-900 border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      ₹{income.amount.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                        sourceColors[income.source]
                      }`}
                    >
                      {income.source}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {income.date
                      ? new Date(income.date).toLocaleDateString()
                      : new Date(income.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(income)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(income._id)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                >
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

export default Income;
