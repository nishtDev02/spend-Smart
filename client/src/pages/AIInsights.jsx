import React from 'react'
import { useState, useEffect } from 'react'
import API from '../utils/axios'
import { Sparkles, TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react'

const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res =  await API.get('/ai/insights')
      setData(res.data);
    } catch (error) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => { fetchInsights() }, []);

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
            <Sparkles size={24} className='text-purple-400' />
            AI Insights
          </h1>
          <p className='text-gray-400 text-sm mt-1'>Personalized financial advice powered by AI</p>
        </div>
        <button
        onClick={fetchInsights}
        disabled={loading}
        className='flex items-center gap-2 border border-white/10 hover:border-purple-500/30 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50'
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* error */}
      {error && (
        <div className='bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-6'>
          {error}
        </div>
      )}

      {/* loading */}
      {loading && (
        <div className='flex flex-col items-center justify-center py-20 gap-4'>
          <div className='w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin'></div>
          <p className='text-gray-400 text-sm'>AI is analyzing your finances...</p>
        </div>
      )}

      {/* Data */}
      {!loading && data && (
        <div className='space-y-6'>

          {/* Summary cards */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            {[
              {
                label: 'Total Income',
                value: `₹${data.summary.totalIncome.toLocaleString()}`,
                icon: <TrendingUp size={20} />,
                color: 'emerald'
              },
              {
                label: 'Total Expenses',
                value: `₹${data.summary.totalExpense.toLocaleString()}`,
                icon: <TrendingDown size={20} />,
                color: 'red'
              },
              {
                label: 'Net Savings',
                value: `₹${data.summary.savings.toLocaleString()}`,
                icon: <Wallet size={20} />,
                color: data.summary.savings >= 0 ? 'emerald' : 'red'
              },
            ].map((stat, i) => (
              <div key={i} className={`p-5 rounded-2xl border bg-gray-900 ${
                stat.color === 'emerald' ? 'border-emerald-500/20' : 'border-red-500/20'
              }`}>
                <div className='flex items-center justify-between mb-3'>
                  <span className='text-gray-400 text-sm'>{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {stat.icon}
                  </div>
                </div>
                <div className='text-2xl font-bold text-white'>{stat.value}</div>
              </div>
            ))}
          </div>


          {/* Savings rate */}
          <div className='bg-gray-900 border border-white/5 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-gray-400 text-sm'>Savings Rate</span>
              <span className='text-white font-bold'>{data.summary.savingsRate}%</span>
            </div>
            <div className='w-full bg-gray-800 rounded-full h-2.5'>
              <div className={`h-2.5 rounded-full transition-all ${
                  data.summary.savingsRate >= 20 ? 'bg-emerald-500' : 'bg-red-500'
                }`} style={{ width: `${Math.min(data.summary.savingsRate, 100)}%` }}></div>
            </div>
            <p className='text-gray-500 text-xs mt-2'>
            {data.summary.savingsRate >= 20 ? '✅ Great savings rate!' : '⚠️ Try to save at least 20% of income'}
            </p>
          </div>

          {/* AI insights */}
          <div className='bg-linear-to-br from-purple-900/30 to-gray-900 border border-purple-500/20 rounded-2xl p-6'>
            <div className='flex items-center gap-2 mb-6'>
              <div className='w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400'>
                <Sparkles size={18} />
              </div>
              <h2 className='text-white font-semibold'>AI Financial Advisor</h2>
              <span className='text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20'>
                Powered by Groq
              </span>
            </div>

            {/* insights text */}
            <div className='space-y-4'>
              {data.insights.split('\n\n').filter(p => p.trim()).map((paragraph, i) => (
                <p key={i} className='text-gray-300 text-sm leading-relaxed'>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Empty state */}
      {!loading && !data && !error && (
        <div className='text-center py-20'>
          <Sparkles size={48} className='text-gray-700 mx-auto mb-4' />
          <p className='text-gray-400 mb-4'>No insights yet</p>
          <button
          onClick={fetchInsights}
          className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all'
          >
            Get AI Insights
          </button>
        </div>
      )}
    </div>
  )
}

export default AIInsights
