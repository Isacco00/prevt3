import {StandSection} from "@/components/preventivi/StandSection.tsx";
import {StorageSection} from "@/components/preventivi/StorageSection.tsx";
import {DeskSection} from "@/components/DeskSection.tsx";
import {ExpositoreSection} from "@/components/ExpositoreSection.tsx";
import {ServicesSection} from "@/components/ServicesSection.tsx";
import {AltriBeniServiziSection} from "@/components/AltriBeniServiziSection.tsx";
import {CondizioniFornituraSection} from "@/components/CondizioniFornituraSection.tsx";

interface Props {
    formData: PreventivoFormData;
    setFormData: React.Dispatch<React.SetStateAction<PreventivoFormData>>;
}

export function PreventivoSections({formData, setFormData}: Props) {
    return (
        <div className="space-y-4">

            <StorageSection formData={formData} setFormData={setFormData}/>

            <DeskSection formData={formData} setFormData={setFormData}/>

            <ExpositoreSection formData={formData} setFormData={setFormData}/>

            <ServicesSection formData={formData} setFormData={setFormData}/>

            <AltriBeniServiziSection formData={formData} setFormData={setFormData}/>

            <CondizioniFornituraSection
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}
