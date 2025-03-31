import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { companiesApi } from '@/shared/api/companies';
import { Badge } from '@/components/ui/badge';
export default async function CompaniesAnalyticsPage() {
  const companies = await companiesApi.getAll();
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Компании</h1>
        <Link href="/analytics/companies/create">
          <Button>Добавить компанию</Button>
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {companies.items.map((company) => (
          <Card key={company._id}>
            <CardHeader>
              <CardTitle>{company.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full aspect-square object-cover rounded-md"
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-light">{company.description}</p>
                <Badge variant="outline">Slug - {company.slug}</Badge>
                <p>Разделы:</p>
                <div className="flex flex-wrap gap-2">
                  {company.dashboards.map((dashboard, counter) => (
                    <Badge key={counter} variant="outline">
                      {dashboard.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    className="w-full"
                    href={`/analytics/companies/${company._id}/edit`}>
                    <Button className="w-full" variant="default">
                      Управлять
                    </Button>
                  </Link>
                  <Link
                    className="w-full"
                    href={`/analytics/companies/${company._id}`}>
                    <Button className="w-full" variant="default">
                      Просмотр
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
