import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl shadow-xl p-12 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Kodbank</h1>
          <p className="text-white/90 text-lg mb-8">
            Your secure digital banking solution
          </p>
          <div className="space-y-4">
            <Link
              to="/signup"
              className="block w-full bg-white text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition duration-300"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="block w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/10 transition duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
