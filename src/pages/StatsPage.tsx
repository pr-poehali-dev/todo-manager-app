import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

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
  urgent: 'from-pink-500 to-red-500',
  soon: 'from-yellow-400 to-orange-400',
  tomorrow: 'from-blue-400 to-indigo-500',
  week: 'from-green-400 to-emerald-500'
};

export default function StatsPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statsByCategory = Object.keys(categoryLabels).map(cat => {
    const categoryTasks = tasks.filter(task => task.category === cat);
    const completed = categoryTasks.filter(task => task.completed).length;
    const total = categoryTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      category: cat,
      label: categoryLabels[cat as keyof typeof categoryLabels],
      total,
      completed,
      active: total - completed,
      rate,
      color: categoryColors[cat as keyof typeof categoryColors]
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="BarChart3" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Статистика</h2>
            <p className="text-gray-600">Анализ вашей продуктивности</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <Icon name="ListTodo" size={32} />
            <span className="text-5xl font-bold">{totalTasks}</span>
          </div>
          <p className="text-purple-100 font-semibold">Всего задач</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <Icon name="CheckCircle2" size={32} />
            <span className="text-5xl font-bold">{completedTasks}</span>
          </div>
          <p className="text-green-100 font-semibold">Выполнено</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={32} />
            <span className="text-5xl font-bold">{activeTasks}</span>
          </div>
          <p className="text-blue-100 font-semibold">В процессе</p>
        </Card>
      </div>

      <Card className="p-8 mb-8 bg-white/90 backdrop-blur-sm shadow-lg animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Общий прогресс</h3>
          <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {completionRate}%
          </span>
        </div>
        <Progress value={completionRate} className="h-4" />
        <p className="text-gray-600 mt-4 text-center">
          {completionRate === 100 ? 'Все задачи выполнены! 🎉' :
           completionRate >= 75 ? 'Отличный прогресс!' :
           completionRate >= 50 ? 'Хорошая работа!' :
           completionRate >= 25 ? 'Продолжайте в том же духе!' :
           'Начните выполнять задачи!'}
        </p>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Статистика по категориям</h3>
        {statsByCategory.map((stat, index) => (
          <Card 
            key={stat.category}
            className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-800">{stat.label}</h4>
              <div className="flex space-x-4 text-sm">
                <span className="text-gray-600">Всего: <span className="font-semibold">{stat.total}</span></span>
                <span className="text-green-600">Готово: <span className="font-semibold">{stat.completed}</span></span>
                <span className="text-blue-600">В работе: <span className="font-semibold">{stat.active}</span></span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Процент завершения</span>
                <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.rate}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
