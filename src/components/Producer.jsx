import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, CheckCircle2, Circle, Sparkles, Download, Upload } from 'lucide-react';

const Producer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasksMap, setTasksMap] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [showConfetti, setShowConfetti] = useState(null);

  // Load and clean tasks from localStorage on initial render
  useEffect(() => {
    const loadAndCleanTasks = () => {
      const savedTasks = localStorage.getItem('producerTasks');
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        
        // Clean up completed tasks older than 7 days but keep incomplete ones
        const cleanedTasks = Object.entries(tasks).reduce((acc, [date, dateTasks]) => {
          const taskDate = new Date(date);
          const today = new Date();
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(today.getDate() - 7);

          const filteredTasks = dateTasks.filter(task => 
            !task.completed || (task.completed && taskDate > sevenDaysAgo)
          );

          if (filteredTasks.length > 0) {
            acc[date] = filteredTasks;
          }
          return acc;
        }, {});

        setTasksMap(cleanedTasks);
        localStorage.setItem('producerTasks', JSON.stringify(cleanedTasks));
      }

      // Check if it's a new day
      const lastVisit = localStorage.getItem('lastVisitDate');
      const today = new Date().toISOString().split('T')[0];
      
      if (lastVisit !== today) {
        // Move yesterday's incomplete tasks to today
        if (lastVisit && savedTasks) {
          const tasks = JSON.parse(savedTasks);
          const yesterdayTasks = tasks[lastVisit]?.filter(task => !task.completed) || [];
          if (yesterdayTasks.length > 0) {
            setTasksMap(prev => ({
              ...prev,
              [today]: [...(prev[today] || []), ...yesterdayTasks.map(task => ({
                ...task,
                id: Date.now() + Math.random(),
                movedFrom: lastVisit
              }))]
            }));
          }
        }
        localStorage.setItem('lastVisitDate', today);
      }
    };

    loadAndCleanTasks();
    // Run cleanup every day
    const cleanupInterval = setInterval(loadAndCleanTasks, 24 * 60 * 60 * 1000);
    return () => clearInterval(cleanupInterval);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('producerTasks', JSON.stringify(tasksMap));
  }, [tasksMap]);

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasksMap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `producer-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    link.click();
  };

  const importTasks = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTasks = JSON.parse(e.target.result);
          setTasksMap(prev => ({...prev, ...importedTasks}));
        } catch (error) {
          console.error('Error importing tasks:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        created: new Date().toLocaleTimeString(),
      };

      setTasksMap(prev => ({
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), newTask]
      }));
      setInputValue('');
    }
  };

  const toggleTask = (taskId) => {
    setTasksMap(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map(task => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            setShowConfetti(taskId);
            setTimeout(() => setShowConfetti(null), 2000);
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    }));
  };

  const deleteTask = (taskId) => {
    setTasksMap(prev => ({
      ...prev,
      [selectedDate]: prev[selectedDate].filter(task => task.id !== taskId)
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCompletedCount = (date) => {
    return tasksMap[date]?.filter(task => task.completed).length || 0;
  };

  const getTotalCount = (date) => {
    return tasksMap[date]?.length || 0;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Sidebar Calendar */}
      <div className="w-72 bg-gray-800 p-6 border-r border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <Calendar className="text-blue-400" size={24} />
            Calendar
          </h2>
          <div className="flex gap-2">
            <button
              onClick={exportTasks}
              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
              title="Backup Tasks"
            >
              <Download size={20} />
            </button>
            <label className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
              <Upload size={20} />
              <input
                type="file"
                accept=".json"
                onChange={importTasks}
                className="hidden"
                title="Import Tasks"
              />
            </label>
          </div>
        </div>
        <div className="space-y-3">
          {getDates().map(date => {
            const completed = getCompletedCount(date);
            const total = getTotalCount(date);
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-102 ${
                  selectedDate === date 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                <div className="font-medium">{formatDate(date)}</div>
                {total > 0 && (
                  <div className={`text-xs mt-1 ${selectedDate === date ? 'text-blue-200' : 'text-gray-400'}`}>
                    {completed}/{total} completed
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-6 w-full p-3 border rounded-xl bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              {formatDate(selectedDate)}
            </h1>
            <div className="text-sm text-gray-400">
              {getCompletedCount(selectedDate)}/{getTotalCount(selectedDate)} tasks completed
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What would you like to accomplish?"
                className="flex-1 px-6 py-3 text-lg bg-gray-700 border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition-all hover:shadow-lg transform hover:scale-105"
              >
                Add Task
              </button>
            </div>
          </form>

          <ul className="space-y-3">
            {(tasksMap[selectedDate] || []).map(task => (
              <li 
                key={task.id}
                className={`group flex items-center gap-4 p-4 bg-gray-800 rounded-xl shadow-sm hover:shadow transition-all ${
                  task.completed ? 'bg-opacity-50' : 'hover:shadow-md'
                } ${showConfetti === task.id ? 'animate-bounce' : ''}`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0 focus:outline-none"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 group-hover:text-blue-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className={`text-lg transition-all ${
                    task.completed 
                      ? 'line-through text-gray-500' 
                      : 'text-gray-200'
                  }`}>
                    {task.text}
                    {task.movedFrom && (
                      <span className="ml-2 text-xs text-gray-500">
                        (moved from {formatDate(task.movedFrom)})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Added at {task.created}
                  </div>
                </div>
                {showConfetti === task.id && (
                  <Sparkles className="absolute right-4 text-yellow-500 animate-ping" />
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 focus:outline-none transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>

          {(!tasksMap[selectedDate] || tasksMap[selectedDate].length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No tasks for this day. Time to be productive!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Producer;