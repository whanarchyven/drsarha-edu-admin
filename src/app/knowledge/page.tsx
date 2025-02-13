import Link from 'next/link';

export default function KnowledgePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">База знаний</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          href="/knowledge/brochures"
          className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Брошюры</h2>
          <p className="text-muted-foreground">
            Управление информационными брошюрами
          </p>
        </Link>

        <Link
          href="/knowledge/lections"
          className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Лекции</h2>
          <p className="text-muted-foreground">
            Управление обучающими лекциями
          </p>
        </Link>

        <Link
          href="/knowledge/clinic-tasks"
          className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Клинические задачи</h2>
          <p className="text-muted-foreground">
            Управление клиническими задачами
          </p>
        </Link>

        <Link
          href="/knowledge/clinic-atlases"
          className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Клинические атласы</h2>
          <p className="text-muted-foreground">
            Управление клиническими атласами
          </p>
        </Link>

        <Link
          href="/knowledge/interactive-tasks"
          className="p-6 border rounded-lg hover:border-primary transition-colors">
          <h2 className="text-xl font-semibold mb-2">Интерактивные задачи</h2>
          <p className="text-muted-foreground">
            Управление интерактивными заданиями
          </p>
        </Link>
      </div>
    </div>
  );
}
