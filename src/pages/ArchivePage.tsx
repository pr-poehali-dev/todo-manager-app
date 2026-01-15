import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'urgent' | 'soon' | 'tomorrow' | 'week';
  createdAt: Date;
}

const categoryLabels = {
  urgent: 'Срочно',
  soon: 'Не так срочно',
  tomorrow: 'Можно завтра',
  week: 'К следующей неделе'
};

const categoryColors = {
  urgent: 'bg-urgent',
  soon: 'bg-soon',
  tomorrow: 'bg-tomorrow',
  week: 'bg-week'
};

export default function ArchivePage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const completedTasks = tasks.filter(task => task.completed);

  const restoreTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: false } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    toast.success('Задача восстановлена');
  };

  const deleteTask = (id: string) => {
    if (confirm('Удалить задачу навсегда?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      toast.success('Задача удалена');
    }
  };

  const clearArchive = () => {
    if (confirm('Очистить весь архив?')) {
      const updatedTasks = tasks.filter(task => !task.completed);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      toast.success('Архив очищен');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Archive" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Архив</h2>
              <p className="text-gray-600">Выполненные задачи</p>
            </div>
          </div>
          
          {completedTasks.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearArchive}
              className="shadow-md"
            >
              <Icon name="Trash2" size={18} className="mr-2" />
              Очистить архив
            </Button>
          )}
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <Card className="p-12 text-center bg-white/80 backdrop-blur-sm shadow-lg animate-scale-in">
          <Icon name="Inbox" size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Архив пуст</h3>
          <p className="text-gray-500">Выполненные задачи появятся здесь</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {completedTasks.map((task, index) => (
            <Card 
              key={task.id}
              className="p-4 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Icon name="CheckCircle2" size={24} className="text-green-500" />
                  <div className="flex-1">
                    <p className="text-gray-600 line-through mb-1">{task.text}</p>
                    <Badge className={`${categoryColors[task.category]} border-none text-gray-700`}>
                      {categoryLabels[task.category]}
                    </Badge>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => restoreTask(task.id)}
                    className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                  >
                    <Icon name="RotateCcw" size={16} className="mr-2" />
                    Восстановить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteTask(task.id)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
