import { NozologyForm } from '../_components/NozologyForm';

export default function CreateNozologyPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Создание нозологии</h1>
      <NozologyForm />
    </div>
  );
}
