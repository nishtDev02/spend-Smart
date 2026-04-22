import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/axios'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, TrendingDown, Wallet, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Dashboard = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        API.get('/income'),
        API.get('/expenses')
      ])
      setIncomes(incomeRes.data || []);
      setExpenses(expenseRes.data || []);
    } catch (error) { 
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  // category wise pie chart data
  const categoryData = (expenses || []).reduce((acc, exp) => {
    const existing = acc.find(item => item.name === exp.category);
    if(existing) existing.value += exp.amount;
    else acc.push({ name: exp.category, value: exp.amount })
    return acc;
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl text-white font-bold'>
          Good day, <span>{user?.username}</span> 👋
        </h1>
        <p className='text-gray-400 text-sm mt-1'>Here's your financial overview</p>
      </div>

      {/* stats card */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {[
          {
            label: 'Total Income',
            value: `₹${totalIncome.toLocaleString()}`,
            icon: <TrendingUp size={20} />,
            color: 'emerald',
            sub: `${incomes.length} transactions`
          },
          {
            label: 'Total Expenses',
            value: `₹${totalExpense.toLocaleString()}`,
            icon: <TrendingDown size={20} />,
            color: 'red',
            sub: `${expenses.length} transactions`
          },
          {
            label: 'Net Savings',
            value: `₹${savings.toLocaleString()}`,
            icon: <Wallet size={20} />,
            color: savings >= 0 ? 'emerald' : 'red',
            sub: savings >= 0 ? 'Great Job! 🎉' : 'Overspent!'
          },
          {
            label: 'Savings Rate',
            value: `${savingsRate}%`,
            icon: <ArrowUpRight size={20} />,
            color: savingsRate >= 20 ? 'emerald' : 'yellow',
            sub: savingsRate >= 20 ? 'On track!' : 'Needs improvement'
          },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border bg-gray-900 ${
            stat.color === 'emerald' ? 'border-emerald-500/20' :
            stat.color === 'red' ? 'border-red-500/20' :
            'border-yellow-500/20'
          }`}>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-gray-400 text-sm'>{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                stat.color === 'red' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400' 
              }`}>
                {stat.icon}
              </div>
            </div>
            <div className='text-2xl font-bold text-white mb-1'>{stat.value}</div>
            <div className='text-xs text-gray-500'>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts & recents */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Pie chart */}
        <div className='bg-gray-900 border border-white/5 rounded-2xl p-6'>
          <h2 className='text-white font-semibold mb-6'>Expense Breakdown</h2>
          {categoryData.length === 0 ? (
            <div className='flex items-center justify-center h-48 text-gray-500'>
              No expenses yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                data={categoryData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey='value'
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          <div className='flex flex-wrap gap-3 mt-4'>
            {categoryData.map((item, i) => (
              <div key={i} className='flex items-center gap-1.5'>
                <div className='w-2.5 h-2.5 rounded-full'  style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className='text-gray-400 text-xs capitalize'>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className='bg-gray-900 border border-white/5 rounded-2xl p-6'>
          <h2 className='text-white font-semibold mb-6'>Recent Transactions</h2>
          <div className='space-y-3'>
            {[...incomes.slice(0, 3).map(i => ({...i, type: 'income'})),
              ...expenses.slice(0, 3).map(i => ({...i, type: 'expense'}))]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 6)
              .map((item, i) => (
                <div className='flex items-center justify-between py-2 border-b border-white/5 last:border-0'>
                  <div className='flex items-center gap-3'>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    </div>
                    <div>
                      <p className='text-white text-sm capitalize'>{item.source || item.category}</p>
                      <p className='text-gray-500 text-xs'>{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-semibold text-sm ${
                    item.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                  {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                  </span>
                </div>
            ))}
            {incomes.length === 0 && expenses.length === 0 && (
              <div className='text-center py-8 text-gray-500 text-sm'>
                No transactions yet - add income or expenses!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          { label: 'Add Income', path: '/income', color: 'emerald', icon: <TrendingUp size={20} />},
          { label: 'Add Expense', path: '/expenses', color: 'red', icon: <TrendingDown size={20} />},
          { label: 'Get AI Insights', path: '/ai-insights', color: 'purple', icon: <Sparkles size={20} />},
        ].map((action, i) => (
          <Link
          key={i}
          to={action.path}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
            action.color === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' :
            action.color === 'red' ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10' :
            'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10'
          }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              action.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
              action.color === 'red' ? 'bg-red-500/20 text-red-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {action.icon}
            </div>
            <span className='text-white font-medium'>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
