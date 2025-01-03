import React, { useState } from 'react';
import Producer from './components/Producer';
import Ideas from './components/Ideas';
import { Calendar, Lightbulb } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('tasks');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Navigation Header */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 h-16 items-center">
            <button
              onClick={() => setCurrentPage('tasks')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                currentPage === 'tasks' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Tasks
            </button>
            
            <button
              onClick={() => setCurrentPage('ideas')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                currentPage === 'ideas' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              Ideas
            </button>
          </div>
        </div>
      </nav>

      {/* Keep both components mounted but hide/show based on currentPage */}
      <div className="w-full">
        <div className={currentPage === 'tasks' ? 'block' : 'hidden'}>
          <Producer />
        </div>
        <div className={currentPage === 'ideas' ? 'block' : 'hidden'}>
          <Ideas />
        </div>
      </div>
    </div>
  );
}

export default App;