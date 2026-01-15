import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(false);

  const exportData = () => {
    const tasks = localStorage.getItem('tasks');
    if (!tasks) {
      toast.error('Нет данных для экспорта');
      return;
    }

    const dataStr = JSON.stringify(JSON.parse(tasks), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Данные экспортированы');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const tasks = JSON.parse(content);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        toast.success('Данные импортированы! Обновите страницу.');
      } catch (error) {
        toast.error('Ошибка чтения файла');
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm('Удалить все задачи? Это действие нельзя отменить!')) {
      localStorage.removeItem('tasks');
      toast.success('Все данные удалены. Обновите страницу.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Icon name="Settings" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Настройки</h2>
            <p className="text-gray-600">Управление приложением</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="Palette" size={24} className="mr-2 text-purple-600" />
            Внешний вид
          </h3>
          <Separator className="mb-4" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme" className="text-base font-semibold text-gray-700">Темная тема</Label>
              <p className="text-sm text-gray-500">Включить темный режим интерфейса</p>
            </div>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => {
                setTheme(checked ? 'dark' : 'light');
                toast.info('Темная тема скоро будет доступна');
              }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="Bell" size={24} className="mr-2 text-purple-600" />
            Уведомления
          </h3>
          <Separator className="mb-4" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base font-semibold text-gray-700">Уведомления</Label>
              <p className="text-sm text-gray-500">Получать напоминания о задачах</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked);
                toast.info('Уведомления скоро будут доступны');
              }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon name="Database" size={24} className="mr-2 text-purple-600" />
            Управление данными
          </h3>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold text-gray-700 mb-2 block">Экспорт данных</Label>
              <p className="text-sm text-gray-500 mb-3">Сохранить все задачи в JSON файл</p>
              <Button 
                onClick={exportData}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
              >
                <Icon name="Download" size={18} className="mr-2" />
                Экспортировать данные
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-semibold text-gray-700 mb-2 block">Импорт данных</Label>
              <p className="text-sm text-gray-500 mb-3">Загрузить задачи из JSON файла</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-file"
                />
                <Button 
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-md"
                >
                  <Icon name="Upload" size={18} className="mr-2" />
                  Импортировать данные
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-semibold text-gray-700 mb-2 block">Сброс данных</Label>
              <p className="text-sm text-gray-500 mb-3">Удалить все задачи навсегда</p>
              <Button 
                onClick={resetData}
                variant="destructive"
                className="w-full shadow-md"
              >
                <Icon name="Trash2" size={18} className="mr-2" />
                Удалить все данные
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 shadow-lg animate-scale-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={24} className="text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-800 mb-1">О приложении</h4>
              <p className="text-sm text-gray-700">
                <strong>TaskFlow</strong> — удобный планировщик задач с разделением по срочности.
                Все данные хранятся локально в вашем браузере.
              </p>
              <p className="text-xs text-gray-600 mt-2">Версия: 1.0.0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
