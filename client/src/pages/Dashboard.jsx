import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const [balance, setBalance] = useState(0)
  const [transferData, setTransferData] = useState({
    receiverEmail: '',
    amount: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setBalance(response.data.balance)
    } catch (err) {
      setError('Failed to fetch balance')
    }
  }

  const handleTransfer = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/api/transfer', {
        receiverEmail: transferData.receiverEmail,
        amount: parseFloat(transferData.amount)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setSuccess('Transfer successful!')
      setTransferData({ receiverEmail: '', amount: '' })
      fetchBalance()
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleChange = (e) => {
    setTransferData({
      ...transferData,
      [e.target.name]: e.target.value
    })
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/80">Welcome back, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600/80 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </div>

          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Your Balance</h2>
            <p className="text-4xl font-bold text-white">${balance.toFixed(2)}</p>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Transfer Money</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-white p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Receiver Email
              </label>
              <input
                type="email"
                name="receiverEmail"
                value={transferData.receiverEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter receiver's email"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={transferData.amount}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter amount"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Transfer Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
