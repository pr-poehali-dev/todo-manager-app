import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'urgent' | 'soon' | 'tomorrow' | 'week';
  createdAt: Date;
}

const categories = [
  { id: 'urgent', label: 'Срочно', color: 'bg-urgent', icon: 'Flame' },
  { id: 'soon', label: 'Не так срочно', color: 'bg-soon', icon: 'Clock' },
  { id: 'tomorrow', label: 'Можно завтра', color: 'bg-tomorrow', icon: 'Calendar' },
  { id: 'week', label: 'К следующей неделе', color: 'bg-week', icon: 'CalendarDays' }
] as const;

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Task['category']>('urgent');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTaskText.trim()) {
      toast.error('Введите текст задачи');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      category: selectedCategory,
      createdAt: new Date()
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    toast.success('Задача добавлена');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    if (confirm('Удалить задачу?')) {
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Задача удалена');
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
    toast.success('Задача обновлена');
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Создать новую задачу</h2>
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-purple-100">
          <div className="flex flex-col space-y-4">
            <Input
              placeholder="Что нужно сделать?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="text-lg border-purple-200 focus:border-purple-400"
            />
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id as Task['category'])}
                  className={`transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <Icon name={cat.icon} size={16} className="mr-2" />
                  {cat.label}
                </Button>
              ))}
            </div>

            <Button 
              onClick={addTask}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить задачу
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => {
          const categoryTasks = getTasksByCategory(category.id);
          
          return (
            <div 
              key={category.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className={`${category.color} border-none shadow-lg overflow-hidden`}>
                <div className="p-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name={category.icon} size={24} className="text-gray-700" />
                      <h3 className="text-lg font-bold text-gray-800">{category.label}</h3>
                    </div>
                    <span className="bg-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
                      {categoryTasks.length}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 min-h-[300px] max-h-[600px] overflow-y-auto">
                  {categoryTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Нет задач</p>
                    </div>
                  ) : (
                    categoryTasks.map((task) => (
                      <Card 
                        key={task.id}
                        className="p-3 bg-white/95 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-200 border-gray-100 animate-scale-in"
                      >
                        {editingId === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                              className="text-sm"
                            />
                            <div className="flex space-x-2">
                              <Button 
                                size="sm"
                                onClick={() => saveEdit(task.id)}
                                className="flex-1 bg-green-500 hover:bg-green-600"
                              >
                                <Icon name="Check" size={14} />
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="flex-1"
                              >
                                <Icon name="X" size={14} />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                                className="mt-1"
                              />
                              <p className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                {task.text}
                              </p>
                            </div>
                            
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(task)}
                                className="flex-1 h-8 text-xs hover:bg-purple-50"
                              >
                                <Icon name="Pencil" size={14} className="mr-1" />
                                Изменить
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteTask(task.id)}
                                className="flex-1 h-8 text-xs hover:bg-red-50 hover:text-red-600"
                              >
                                <Icon name="Trash2" size={14} className="mr-1" />
                                Удалить
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
