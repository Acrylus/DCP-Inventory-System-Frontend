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

export const updateMunicipality = async (
    municipality: Municipality
): Promise<Municipality> => {
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
        const responseData = await response.json();

        const data: Municipality = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating municipality:", error);
        throw error;
    }
};
