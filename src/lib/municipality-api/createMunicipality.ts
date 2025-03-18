import BASE_URL from "../../util/BaseUrl";

interface Municipality {
    municipalityId: number;
    division: Division[];
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

export const createMunicipality = async (
    municipality: Municipality
): Promise<Municipality> => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(municipality),
        });
        if (!response.ok) {
            throw new Error("Failed to create municipality");
        }

        const responseData = await response.json();

        const data: Municipality = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating municipality:", error);
        throw error;
    }
};
