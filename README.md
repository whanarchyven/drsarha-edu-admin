# Next.js Project

## Первый запуск

Для успешного запуска необходимо:

- Скопировать `.env.example` в `.env.local` и заполнить переменными по образцу. Значение переменных см. ниже в пункте [Переменные среды](#переменные-среды)
- Установить все зависимости (нужно иметь локально установленный Node.js, используемую версию на этом проекте можно посмотреть в package.json):

```bash
npm i
```

- Далее нужно настроить husky, чтобы коммиты не создавались, если есть ошибки eslint + форматирование кода при каждом коммите
- Для этого нужно поочередно выполнить эти 4 команды

```bash
npx husky-init
git add .husky/pre-commit
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## Запуск для разработки

Для успешного запуска необходимо:

- Скопировать `.env.example` в `.env.local` и заполнить переменными по образцу. Значение переменных см. ниже в пункте [Переменные среды](#переменные-среды)
- Запустить локальный dev сервер

```bash
npm run dev
```

## Билд

- Перед тем как запушить изменения, убедитесь сначала, что проект сбилдился локально и нет ошибок

```bash
npm run build
```

## Архитектура проекта

[https://feature-sliced.design/docs/get-started](https://feature-sliced.design/docs/get-started)

## Переменные среды

Значения переменных можно узнать у разработчиков, которые уже работают на проекте или если вы начинаете с нуля, то все значения вносите самостоятельно и далее по необходимости делитесь с другими разработчиками лично. Заполненный .env в гит пушить не рекомендуется, в особенности если там есть важные данные, вроде токенов.
При начальной разработке проекта, когда api для интеграции еще не готово, обязательные поля как правило будут пустые и заполняются позже

| Переменная                      | Значение                                                                                                                             | Обязательно |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| NEXT_PUBLIC_FRONT_BASE_URL      | URL, на котором находится контент (файлы, изображения). Здесь должен быть URL бекенда.                                               | да          |
| NEXT_PUBLIC_FRONT_API_URL       | URL REST API бекенда, формируется по принципу `https://<домен-бекенда>/api`                                                          | да          |
| NEXT_PUBLIC_FRONT_PROXY_API_URL | URL для прокси, например /api/proxy                                                                                                  | да          |
| NEXT_PUBLIC_BASIC_AUTH_LOGIN    | Логин базовой аутентификации для запросов на бекенд. Если бекенд не защищен базовой аутентификацией, можно оставлять пустым.         | нет         |
| NEXT_PUBLIC_BASIC_AUTH_PASSWORD | Пароль базовой аутентификации для запросов на бекенд. Если бекенд не защищен базовой аутентификацией, можно оставлять пустым.        | нет         |
| UNOPTIMIZED_IMAGES              | Нужно ли пропускать оптимизацию изображений. 0 - нет, 1 - да. Оптимизацией изображений занимается бекенд. Значение по умолчанию - 0. | нет         |

# Регламент по стилизации

## Вступление

Для стилизации компонентов в проектах на React/Next.js мы используем Tailwindcss в связке с CVA.  
**CVA (Class Variance Authority)** — библиотека, которая позволяет удобно управлять классами за пределами элементов, создавать различные состояния и комбинации из состояний.

- Документация по CVA [тут](https://cva.style/docs)
- Документация по Tailwindcss [тут](https://tailwindcss.com/docs/)

## Единицы измерения

Всегда используем rem, исключения только для медиа запросов. Для удобства в html по дефолту задан `font-size: 10px`, таким образом 1rem = 10px.

## Название классов

Названия классов должны быть в camelCase с добавлением префикса cva после семантического наименования элемента.
**Пример:**

```typescript
export const cvaSubtitle = cva([
  'hero-cvaSubtitle',
  // тут будут стили
]);
```

## Элементы БЭМ

Самый первый класс cva должен придерживаться naming-conventions из БЭМ, это упростит навигацию по элементам в проекте, позволяет поддерживать код в чистоте. **Пример компонента, стилизованного cva:**

```tsx
const PersonCard = () => {
  const cvaRoot = cva([
    'persconCard-cvaRoot',
    //остальные стили
  ]);

  const cvaImage = cva([
    'persconCard-cvaImage',
    //остальные стили
  ]);

  const cvaTitle = cva([
    'persconCard-cvaTitle',
    //остальные стили
  ]);

  const cvaDescription = cva([
    'persconCard-cvaDescription',
    //остальные стили
  ]);

  return (
    <div className={cvaRoot()}>
      <img className={cvaImage()} />
      <h3 className={cvaTitle()}></h3>
      <p className={cvaDescription()}></p>
    </div>
  );
};
export default PersonCard;
```

## Добавление нескольких классов

Иногда необходимо добавить несколько классов, для этого используем пакет `clsx`.

**Пример:**

```jsx
<span className={clsx(cvaSubtitle(), classNameFromParentComponent)}>
  {' '}
  Какой-то подзаголовок{' '}
</span>
```

## Группировка Tailwind классов

**Плохо:**

```typescript
const cvaMenuLink = cva([
  'inline-block uppercase text-xs whitespace-nowrap transition-colors duration-300 bg-red hover:bg-green',
]);
```

**Хорошо:**

```typescript
const cvaMenuLink = cva([
  'header-cvaMenuLink',
  'inline-block',
  'text-xs uppercase whitespace-nowrap',
  'bg-red hover:bg-green',
  'transition-colors duration-300',
]);
```

## Порядок группировки классов

1. Название компонента и класса (названиеКомпонента-названиеКласса)
2. Тип отображения (grid, flex, inline-block и т.д.)
3. Позиционирование (position, z-index и т.д.)
4. Размеры (width, height и т.д.)
5. Отступы
6. Текстовые стили
7. Визуальное оформление (фон, бордеры, тени)
8. Прочие классы (cursor, selection-none)
9. Стилизация before/after и дочерних элементов

## Адаптация

Адаптивные свойства пишутся рядом с тем свойством, которое адаптируется.

**Пример:**

```typescript
const cvaMenuLink = cva([
  'header-cvaMenuLink',
  'inline-block',
  'text-xs sm:text-sm md:text-md lg:text-lg uppercase whitespace-nowrap',
  'bg-red hover:bg-green',
  'transition-colors duration-300',
]);
```

Важно помнить, что Tailwind — это mobile-first библиотека, что означает, что мобильные свойства должны быть приоритетными. В случае, если вы верстаете сначала ПК версию, адаптируйте мобильные свойства справа налево.

## Пример адаптации:

- Верстаем только ПК версию:

```
text-lg uppercase whitespace-nowrap
```

- Добавляем адаптив под большие планшеты:

```
text-md lg:text-lg uppercase whitespace-nowrap
```

- Добавляем адаптив под маленькие планшеты:

```
text-sm md:text-md lg:text-lg uppercase whitespace-nowrap
```

- Добавляем адаптив под телефоны:

```
text-xs sm:text-sm md:text-md lg:text-lg uppercase whitespace-nowrap
```

## Tailwind конфиг

Конфиг редактируется и дополняется от проекта к проекту.  
При настройке важно:

- Добавить цвета, если их нет в макете. Например, cGray100, cGray200.
- Настроить `screens` для адаптации.
- Настроить `fontSize` и `fontFamily` для шрифтов.
- Настроить `spacing` для отступов (ширина, высота, padding, margin).
- Важно избегать добавления лишних свойств, если они редко используются.

## Tailwind плагины

В разделе plugins можно добавлять плагины, создавая свои классы, например:

```css
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## Tailwind фичи

Свойства, для которых нет сокращений в Tailwind, указываются в квадратных скобках. Например:

```
[backface-visibility:hidden]
```

Кастомные значения в свойствах указываются в квадратных скобках, внутри не должно быть пробелов:

```
w-[12.3rem] w-[calc(100%-5rem)]
```

Обратиться к дочернему элементу можно также в квадратных скобках, используя стандартные селекторы:

```
[&>svg]:w-full [&>span:nth-child(2)]:text-red
```

# Стейт менеджер Zustand

Разберём базовый регламент работы с zustand.Все сторы размещаются в /shared/store

```tsx
import { create } from 'zustand';

interface ExampleStoreState {
  //Определение типов для параметров стейта
  someValue: number;
}

interface ExampleStoreActions {
  //Определение типов для мутаций
  setSomeValue: (someValue: number) => void;
  increment: () => void;
}

export const useExampleStore = create<ExampleStoreValue & ExampleStoreActions>(
  (set) => ({
    someValue: 0, //дефолтное значение
    setSomeValue: (someValue) => {
      //Переопределенние
      set((state) => {
        return {
          someValue,
        };
      });
    },
    increment: () => {
      //использование значений стейта внутри мутации
      set((state) => {
        someValue: state.someValue + 1;
      });
    },
  })
);
```

Использование стейта в компонентах:

```tsx
function Counter() {
  const { someValue, increment } = useStore();
  return (
    <div>
      <span>{someValue}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

# Регламент работы с API

Хорошей практикой, по возможности, является использование SSR (server-side-rendering), с оптимальной ревалидацией. Разберёмся на примере, как, согласно регламенту создавать серверные компоненты с предзагруженным контентом с API.

```tsx
// app/posts/[id]/page.tsx

import { FC } from 'react';
import { axiosInstance } from './axios';

interface Post {
  //Написали интерфейсы для каждой прилетающей с АПИ сущности
  id: string;
  title: string;
  content: string;
}

interface PageProps {
  // Параметры для страницы
  params: { id: string };
}

// Функция для получения данных о посте
async function fetchPostById(id: string): Promise<Post> {
  const res = await axiosInstance(API.getPost(id));
  if (res.data.error) {
    throw new Error(res.data.error);
  }
  return res.json();
}

// Генерация статических параметров (аналог getStaticPaths)
export async function generateStaticParams() {
  const res = await axiosInstance(API.getPosts);
  const posts: Post[] = await res.json();

  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export const revalidate = 60; //ревалидация каждые 60 секунд
//export const dynamic = "force-dynamic"
// при необходимости отключения ревалидации совсем

// Основной компонент страницы
const PostPage: FC<PageProps> = async ({ params }) => {
  const post = await fetchPostById(params.id);
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default PostPage;
```

Мы ещё вернёмся к регламенту работы с API при рассмотрении архитектуры проекта.

# Архитектура проекта FSD

Документация по FSD [тут](https://feature-sliced.design/docs/get-started/overview)

Статья с кратким резюме FSD [тут](https://habr.com/ru/companies/piter/articles/744824/)

Если кратко, то в проекте существуют:

/app/**_directory-name/page.tsx_** - страница, которая влияет на роутинг next.js. Здесь размещаются необходимые страницы проекта.

/app/**_widgets_**/\* - здесь размещаются так называемые _**виджеты**_ , отдельные программные сущности, которые выполняют определённые глобальные функции. Такими могут быть например - Каталог на странице интернет магазина, какой то кальлкулятор, конструктор и т.д.

/app/**_features_**/\* - здесь размещаются **_фичи_** - утилиты, которые могут влиять на все выше слои архитектуры. Например - Theming, пуш уведомления и тд.

/app/**_entities_**/\* - слой для бизнес-сущностей, например Post, User и тд.

/app/**_shared_**/\* - слой для UI элементов и часто переиспользуемых функций/элементов.

---

**_В /shared/api/ - Возвращаемся к API. Базово, там находятся:_**

- api.ts - тут важным экспортируем элементом является API. В нём записываются все эндпоинты (роуты) к апи.
- axios.ts - axiosInstance. Это объект, в котором базово преднастроены все запросы, автоматическое проксирование, хеддеры, базовая авторизация и тд.
- prepareHeaders - заголовки для axiosInstance

Для каждого эндпоинта создаём директорию /shared/api/_**function-name**_/

Там размещаем два файла - index.ts и types.ts. Во втором прописываем типы данных прилетающих с API. Пример:

```typescript
//types.ts
export interface IPageProps {
  title: string;
  content: string;
}
```

```typescript
//index.ts
import { API } from '../api';
import { axiosInstance } from '../axios';

export const getPage = async (slug?: string) => {
  const result = await axiosInstance.get<IPageProps>(API.getPages, {
    //Взяли эндпоинт с API
    params: {
      slug,
    },
  });

  return result.data;
};
```

---

Кастомные хуки размещаем /app/shared/hooks/

В /shared/store/ размещаем сторы Zustand

В /shared/utils - часто переиспользуемые функции (форматтеры, валидаторы и тд)

---

Свой UI мы базируем на [ShadCN](https://ui.shadcn.com/docs). При установке компонента из библиотеки ShadCN, он попадает в /app/shared/ui/.

Для добавления компонента из библиотеки ShadCn используем

```
npx shadcn@latest add имя_компонента
```

При необходимости, можно добавлять кастомные UI компоненты.

---
