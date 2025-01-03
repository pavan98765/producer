import React from 'react';
import { Calendar, Lightbulb } from 'lucide-react';

const Layout = ({ children, activePage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 h-16 items-center">
            <button
              onClick={() => onNavigate('tasks')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                activePage === 'tasks' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Tasks
            </button>
            
            <button
              onClick={() => onNavigate('ideas')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                activePage === 'ideas' 
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

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;