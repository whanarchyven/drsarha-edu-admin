import CreateCompanyForm from "@/widgets/CreateCompanyForm/create-company-form";
import { companiesApi } from "@/shared/api/companies";
import EditCompanyForm from "@/widgets/EditCompanyForm/edit-company-form";
export default async function CreateCompanyAnalyticsPage({params}:{params: {id: string}}){
    const company = await companiesApi.getById(params.id);
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Редактировать компанию</h1>
            <EditCompanyForm initialCompany={company}/>
        </div>
    )
}