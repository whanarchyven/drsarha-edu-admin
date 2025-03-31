import CreateCompanyForm from "@/widgets/CreateCompanyForm/create-company-form";

export default function CreateCompanyAnalyticsPage(){
    return(
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Создать компанию</h1>
            <CreateCompanyForm/>
        </div>
    )
}