import BASE_URL from "../../util/BaseUrl";

interface Municipality {
    municipalityId: number;
    name: string;
    division: Division;
}

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

export const updateMunicipality = async (municipality: Municipality) => {
    try {
        const response = await fetch(
            `${BASE_URL}/district/update/${municipality.municipalityId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(municipality),
            }
        );
        if (response.ok) {
            const data = await response.json();
            console.log("Municipality updated successfully:", data);
        } else {
            console.error(
                "Failed to update municipality:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error updating municipality:", error);
    }
};
