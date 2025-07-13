import ArticleLayout from "@/components/ArticleLayout";

const ConceptPurposeMoney = () => {
  return (
    <ArticleLayout
      title="The Concept & Purpose of Money"
      level="Beginner"
    >
      <div className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">?</span>
            </div>
            What Is Money?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Money is a <strong>medium of exchange</strong> that facilitates trade and commerce. Think of it as a universal translator for value - it allows us to easily compare, store, and transfer worth between different goods and services.
          </p>
        </div>

        {/* Three Functions */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            The Three Core Functions of Money
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Medium of Exchange</h4>
              <p className="text-gray-600 text-sm">
                Eliminates the need for bartering by providing a common currency everyone accepts.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Store of Value</h4>
              <p className="text-gray-600 text-sm">
                Allows us to save purchasing power today and use it in the future.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📏</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unit of Account</h4>
              <p className="text-gray-600 text-sm">
                Provides a standard way to measure and compare the value of different things.
              </p>
            </div>
          </div>
        </div>

        {/* Why Money Exists */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            Why Money Had to Be Invented
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-red-700 mb-3">❌ The Problem with Bartering</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Required "double coincidence of wants"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Hard to determine fair exchange rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Difficult to save value for later</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Limited to immediate, local trading</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-700 mb-3">✅ How Money Solved This</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Efficient trade and commerce</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Economic specialization possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Capital accumulation enabled</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Complex economic systems built</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Money's Social Role */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            Money's Role in Society
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Money is more than just a tool for transactions—it's a <strong>social technology</strong> that enables cooperation, innovation, and progress.
            </p>
            <p className="text-gray-700 leading-relaxed">
              It allows societies to organize complex economic activities and allocate resources efficiently, making possible everything from global trade to technological advancement.
            </p>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            Key Takeaways
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-lg mt-1">1.</span>
              <p className="text-gray-700">Money is a social construct designed to facilitate exchange</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-lg mt-1">2.</span>
              <p className="text-gray-700">It serves three functions: exchange, storage, and measurement</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-lg mt-1">3.</span>
              <p className="text-gray-700">Money enables economic efficiency and social cooperation</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-lg mt-1">4.</span>
              <p className="text-gray-700">Understanding money's purpose is crucial for financial literacy</p>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
};

export default ConceptPurposeMoney;