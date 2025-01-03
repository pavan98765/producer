import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Clock, CheckCircle2 } from 'lucide-react';

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load ideas from localStorage
  useEffect(() => {
    const savedIdeas = localStorage.getItem('producerIdeas');
    if (savedIdeas) {
      setIdeas(JSON.parse(savedIdeas));
    }
  }, []);

  // Save ideas to localStorage
  useEffect(() => {
    localStorage.setItem('producerIdeas', JSON.stringify(ideas));
  }, [ideas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newIdea = {
        id: Date.now(),
        text: inputValue.trim(),
        category: 'bucket-list',
        created: new Date().toISOString(),
        priority: 'medium',
        status: 'active'
      };
      setIdeas([...ideas, newIdea]);
      setInputValue('');
    }
  };

  const deleteIdea = (id) => {
    setIdeas(ideas.filter(idea => idea.id !== id));
  };

  const toggleStatus = (id) => {
    setIdeas(ideas.map(idea =>
      idea.id === id 
        ? { ...idea, status: idea.status === 'completed' ? 'active' : 'completed' }
        : idea
    ));
  };

  const togglePriority = (id) => {
    const priorities = ['low', 'medium', 'high'];
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        const currentIndex = priorities.indexOf(idea.priority);
        const nextPriority = priorities[(currentIndex + 1) % priorities.length];
        return { ...idea, priority: nextPriority };
      }
      return idea;
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const filteredIdeas = selectedCategory === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.status === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Ideas & Goals</h1>
        <p className="text-gray-600">Capture your dreams, goals, and future plans.</p>
      </div>

      <div className="mb-8 flex space-x-4">
        {['all', 'active', 'completed'].map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new idea or goal..."
            className="flex-1 px-6 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </form>

      <ul className="space-y-3">
        {filteredIdeas.map(idea => (
          <li 
            key={idea.id}
            className={`group flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow transition-all ${
              idea.status === 'completed' ? 'bg-gray-50' : ''
            }`}
          >
            <button
              onClick={() => toggleStatus(idea.id)}
              className="flex-shrink-0 focus:outline-none"
            >
              <CheckCircle2 
                className={`w-6 h-6 ${
                  idea.status === 'completed' 
                    ? 'text-green-500' 
                    : 'text-gray-400 group-hover:text-blue-500'
                }`} 
              />
            </button>
            
            <div className="flex-1">
              <div className={`text-lg ${
                idea.status === 'completed' 
                  ? 'line-through text-gray-400' 
                  : 'text-gray-700'
              }`}>
                {idea.text}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(idea.created).toLocaleDateString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => togglePriority(idea.id)}
              className="focus:outline-none"
            >
              <Star className={`w-5 h-5 ${getPriorityColor(idea.priority)}`} />
            </button>

            <button
              onClick={() => deleteIdea(idea.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 focus:outline-none transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No ideas yet. Start adding your dreams and goals!
          </p>
        </div>
      )}
    </div>
  );
};

export default Ideas;