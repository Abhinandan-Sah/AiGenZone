// Test component to verify the enhanced preview system
function GeneratedComponent() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-violet-50 to-emerald-50 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Component</h2>
        <div className="bg-white rounded-lg p-4 mb-4 shadow-inner">
          <div className="text-3xl font-bold text-violet-600 mb-2">{count}</div>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            isActive 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isActive ? (
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Inactive
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
