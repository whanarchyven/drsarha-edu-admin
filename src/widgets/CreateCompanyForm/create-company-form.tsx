'use client';

import type React from 'react';

import { useState } from 'react';
import { PlusCircle, X, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInsightQuestions } from '@/shared/hooks/use-insight-questions';
import { BaseInsightQuestionDto } from '@/app/api/client/schemas/baseInsightQuestionDto';
import { companiesApi } from '@/shared/api/companies';
import { toast } from 'sonner';
// Types
enum DashboardType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  TABLE = 'table',
}

interface Scale {
  name: string;
  value: number;
  type: 'linear' | 'multiple';
}

interface Stat {
  name: string;
  type: DashboardType;
  question_id: string;
  scaleAll: number;
  scales: Scale[];
  cols: number;
}

interface Dashboard {
  name: string;
  icon: string;
  stats: Stat[];
}

interface Company {
  _id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  logo: string;
  description: string;
  password: string;
  dashboards: Dashboard[];
}

// Mock questions data

export default function DashboardForm() {
  const [company, setCompany] = useState<Company>({
    _id: '',
    name: '',
    slug: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    logo: '',
    description: '',
    password: '',
    dashboards: [],
  });

  const { questions } = useInsightQuestions();
  console.log(questions);

  const addDashboard = () => {
    setCompany({
      ...company,
      dashboards: [
        ...company.dashboards,
        {
          name: '',
          icon: '',
          stats: [],
        },
      ],
    });
  };

  const updateDashboard = (
    index: number,
    field: keyof Dashboard,
    value: string
  ) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[index] = {
      ...updatedDashboards[index],
      [field]: value,
    };
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const addStat = (dashboardIndex: number) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats.push({
      name: '',
      type: DashboardType.LINE,
      question_id: '',
      scaleAll: 1,
      scales: [],
      cols: 1,
    });
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const updateStat = (
    dashboardIndex: number,
    statIndex: number,
    field: keyof Stat,
    value: any
  ) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats[statIndex] = {
      ...updatedDashboards[dashboardIndex].stats[statIndex],
      [field]: value,
    };
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const addScale = (dashboardIndex: number, statIndex: number) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats[statIndex].scales.push({
      name: '',
      value: 0,
      type: 'linear',
    });
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const updateScale = (
    dashboardIndex: number,
    statIndex: number,
    scaleIndex: number,
    field: keyof Scale,
    value: any
  ) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats[statIndex].scales[scaleIndex] = {
      ...updatedDashboards[dashboardIndex].stats[statIndex].scales[scaleIndex],
      [field]: value,
    };
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const removeScale = (
    dashboardIndex: number,
    statIndex: number,
    scaleIndex: number
  ) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats[statIndex].scales.splice(
      scaleIndex,
      1
    );
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const removeStat = (dashboardIndex: number, statIndex: number) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats.splice(statIndex, 1);
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const removeDashboard = (dashboardIndex: number) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards.splice(dashboardIndex, 1);
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const selectQuestion = (
    dashboardIndex: number,
    statIndex: number,
    questionId: string
  ) => {
    const updatedDashboards = [...company.dashboards];
    updatedDashboards[dashboardIndex].stats[statIndex].question_id = questionId;
    setCompany({ ...company, dashboards: updatedDashboards });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted company:', company);
    try {
      // Убедимся, что у всех статистик есть поле cols
      company.dashboards.forEach(dashboard => {
        dashboard.stats.forEach(stat => {
          if (stat.cols === undefined) {
            stat.cols = 1;
          }
        });
      });
      
      console.log('Company:', company);
      const response = await companiesApi.create(company);
      console.log('Company created:', response);
      toast.success('Компания успешно создана');
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(`Ошибка при создании компании: ${error}`);
    }
    // Here you would typically send the data to your API
  };

  const getQuestionText = (questionId: string) => {
    const question = questions.find(
      (q: BaseInsightQuestionDto) => q.id === questionId
    );
    return question ? question.title : 'Select a question';
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Информация о компании</CardTitle>
            <CardDescription>
              Введите основную информацию о компании
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название компании</Label>
                <Input
                  id="name"
                  value={company.name}
                  onChange={(e) =>
                    setCompany({ ...company, name: e.target.value })
                  }
                  placeholder="Введите название компании"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={company.slug}
                  onChange={(e) =>
                    setCompany({ ...company, slug: e.target.value })
                  }
                  placeholder="company-slug"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль компании</Label>
              <Input
                id="password"
                
                value={company.password}
                onChange={(e) =>
                  setCompany({ ...company, password: e.target.value })
                }
                placeholder="Введите пароль для доступа к компании"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">URL логотипа</Label>
              <Input
                id="logo"
                value={company.logo}
                onChange={(e) =>
                  setCompany({ ...company, logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={company.description}
                onChange={(e) =>
                  setCompany({ ...company, description: e.target.value })
                }
                placeholder="Введите описание компании"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Дашборды</CardTitle>
              <CardDescription>
                Создайте и управляйте дашбордами для этой компании
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={addDashboard}
              variant="outline"
              size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Добавить дашборд
            </Button>
          </CardHeader>
          <CardContent>
            {company.dashboards.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Дашборды еще не добавлены
                </p>
                <Button
                  type="button"
                  onClick={addDashboard}
                  variant="outline"
                  size="sm"
                  className="mt-4">
                  Добавить первый дашборд
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {company.dashboards.map((dashboard, dashboardIndex) => (
                  <AccordionItem
                    key={dashboardIndex}
                    value={`dashboard-${dashboardIndex}`}
                    className="border rounded-lg mb-4 overflow-hidden">
                    <div className="flex items-center justify-between px-4">
                      <AccordionTrigger className="py-2">
                        {dashboard.name || `Дашборд ${dashboardIndex + 1}`}
                      </AccordionTrigger>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDashboard(dashboardIndex);
                        }}
                        className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                    <AccordionContent>
                      <div className="space-y-4 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`dashboard-name-${dashboardIndex}`}>
                              Название дашборда
                            </Label>
                            <Input
                              id={`dashboard-name-${dashboardIndex}`}
                              value={dashboard.name}
                              onChange={(e) =>
                                updateDashboard(
                                  dashboardIndex,
                                  'name',
                                  e.target.value
                                )
                              }
                              placeholder="Введите название дашборда"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`dashboard-icon-${dashboardIndex}`}>
                              Иконка
                            </Label>
                            <Input
                              id={`dashboard-icon-${dashboardIndex}`}
                              value={dashboard.icon}
                              onChange={(e) =>
                                updateDashboard(
                                  dashboardIndex,
                                  'icon',
                                  e.target.value
                                )
                              }
                              placeholder="Название иконки или URL"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Статистика</Label>
                            <Button
                              type="button"
                              onClick={() => addStat(dashboardIndex)}
                              variant="outline"
                              size="sm">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Добавить статистику
                            </Button>
                          </div>

                          {dashboard.stats.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center border border-dashed rounded-lg">
                              <p className="text-muted-foreground text-sm">
                                Статистика еще не добавлена
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {dashboard.stats.map((stat, statIndex) => (
                                <Card key={statIndex} className="relative">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeStat(dashboardIndex, statIndex)
                                    }
                                    className="absolute right-2 top-2 h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Удалить</span>
                                  </Button>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                      {stat.name ||
                                        `Статистика ${statIndex + 1}`}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4 pb-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`stat-name-${dashboardIndex}-${statIndex}`}>
                                          Название статистики
                                        </Label>
                                        <Input
                                          id={`stat-name-${dashboardIndex}-${statIndex}`}
                                          value={stat.name}
                                          onChange={(e) =>
                                            updateStat(
                                              dashboardIndex,
                                              statIndex,
                                              'name',
                                              e.target.value
                                            )
                                          }
                                          placeholder="Введите название статистики"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor={`stat-type-${dashboardIndex}-${statIndex}`}>
                                          Тип
                                        </Label>
                                        <Select
                                          value={stat.type}
                                          onValueChange={(value) =>
                                            updateStat(
                                              dashboardIndex,
                                              statIndex,
                                              'type',
                                              value as DashboardType
                                            )
                                          }>
                                          <SelectTrigger
                                            id={`stat-type-${dashboardIndex}-${statIndex}`}>
                                            <SelectValue placeholder="Выберите тип" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem
                                              value={DashboardType.LINE}>
                                              Линейный
                                            </SelectItem>
                                            <SelectItem
                                              value={DashboardType.BAR}>
                                              Столбчатый
                                            </SelectItem>
                                            <SelectItem
                                              value={DashboardType.PIE}>
                                              Круговой
                                            </SelectItem>
                                            <SelectItem
                                              value={DashboardType.AREA}>
                                              Область
                                            </SelectItem>
                                            <SelectItem
                                              value={DashboardType.TABLE}>
                                              Таблица
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label>Вопрос</Label>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start">
                                            {stat.question_id
                                              ? getQuestionText(
                                                  stat.question_id
                                                )
                                              : 'Выберите вопрос'}
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Выберите вопрос
                                            </DialogTitle>
                                          </DialogHeader>
                                          <ScrollArea className="h-[300px] mt-4">
                                            <div className="space-y-2">
                                              {questions.map((question) => (
                                                <Card
                                                  key={question.id}
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    selectQuestion(
                                                      dashboardIndex,
                                                      statIndex,
                                                      question.id ?? ''
                                                    );
                                                  }}>
                                                  <CardHeader>
                                                    <CardTitle>
                                                      {question.title}
                                                    </CardTitle>
                                                    <CardDescription>
                                                      {question.prompt}
                                                    </CardDescription>
                                                  </CardHeader>
                                                </Card>
                                              ))}
                                            </div>
                                          </ScrollArea>
                                        </DialogContent>
                                      </Dialog>
                                    </div>

                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`scale-all-${dashboardIndex}-${statIndex}`}>
                                        Общий масштаб
                                      </Label>
                                      <Input
                                        id={`scale-all-${dashboardIndex}-${statIndex}`}
                                        type="number"
                                        value={stat.scaleAll}
                                        onChange={(e) =>
                                          updateStat(
                                            dashboardIndex,
                                            statIndex,
                                            'scaleAll',
                                            Number.parseFloat(e.target.value) ||
                                              1
                                          )
                                        }
                                        min="0"
                                        step="0.1"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Label>Масштабы</Label>
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            addScale(dashboardIndex, statIndex)
                                          }
                                          variant="outline"
                                          size="sm">
                                          <PlusCircle className="mr-2 h-4 w-4" />
                                          Добавить масштаб
                                        </Button>
                                      </div>

                                      {stat.scales.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-4 text-center border border-dashed rounded-lg">
                                          <p className="text-muted-foreground text-sm">
                                            Масштабы еще не добавлены
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          {stat.scales.map(
                                            (scale, scaleIndex) => (
                                              <div
                                                key={scaleIndex}
                                                className="flex items-start gap-2 p-3 border rounded-md relative">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                                  <div className="space-y-1">
                                                    <Label
                                                      htmlFor={`scale-name-${dashboardIndex}-${statIndex}-${scaleIndex}`}
                                                      className="text-xs">
                                                      Название
                                                    </Label>
                                                    <Input
                                                      id={`scale-name-${dashboardIndex}-${statIndex}-${scaleIndex}`}
                                                      value={scale.name}
                                                      onChange={(e) =>
                                                        updateScale(
                                                          dashboardIndex,
                                                          statIndex,
                                                          scaleIndex,
                                                          'name',
                                                          e.target.value
                                                        )
                                                      }
                                                      placeholder="Название масштаба"
                                                      className="h-8"
                                                    />
                                                  </div>
                                                  <div className="space-y-1">
                                                    <Label
                                                      htmlFor={`scale-value-${dashboardIndex}-${statIndex}-${scaleIndex}`}
                                                      className="text-xs">
                                                      Значение
                                                    </Label>
                                                    <Input
                                                      id={`scale-value-${dashboardIndex}-${statIndex}-${scaleIndex}`}
                                                      type="number"
                                                      value={scale.value}
                                                      onChange={(e) =>
                                                        updateScale(
                                                          dashboardIndex,
                                                          statIndex,
                                                          scaleIndex,
                                                          'value',
                                                          Number.parseFloat(
                                                            e.target.value
                                                          ) || 0
                                                        )
                                                      }
                                                      placeholder="Значение"
                                                      className="h-8"
                                                      min="0"
                                                      step="0.1"
                                                    />
                                                  </div>
                                                  <div className="space-y-1">
                                                    <Label className="text-xs">
                                                      Тип
                                                    </Label>
                                                    <div className="flex gap-2">
                                                      <Button
                                                        type="button"
                                                        variant={
                                                          scale.type ===
                                                          'linear'
                                                            ? 'default'
                                                            : 'outline'
                                                        }
                                                        size="sm"
                                                        className="flex-1 h-8"
                                                        onClick={() =>
                                                          updateScale(
                                                            dashboardIndex,
                                                            statIndex,
                                                            scaleIndex,
                                                            'type',
                                                            'linear'
                                                          )
                                                        }>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        Линейный
                                                      </Button>
                                                      <Button
                                                        type="button"
                                                        variant={
                                                          scale.type ===
                                                          'multiple'
                                                            ? 'default'
                                                            : 'outline'
                                                        }
                                                        size="sm"
                                                        className="flex-1 h-8"
                                                        onClick={() =>
                                                          updateScale(
                                                            dashboardIndex,
                                                            statIndex,
                                                            scaleIndex,
                                                            'type',
                                                            'multiple'
                                                          )
                                                        }>
                                                        <X className="h-4 w-4 mr-1" />
                                                        Множественный
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </div>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    removeScale(
                                                      dashboardIndex,
                                                      statIndex,
                                                      scaleIndex
                                                    )
                                                  }
                                                  className="h-8 w-8 p-0 mt-5">
                                                  <X className="h-4 w-4" />
                                                  <span className="sr-only">
                                                    Удалить
                                                  </span>
                                                </Button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Отмена</Button>
            <Button type="submit">Сохранить компанию</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
