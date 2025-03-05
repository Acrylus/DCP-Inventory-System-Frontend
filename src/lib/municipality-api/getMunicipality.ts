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

export const getMunicipalityById = async (): Promise<Municipality> => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/get`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch municipality");
        }

        const responseData = await response.json();

        const data: Municipality = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching municipality:", error);
        throw error;
    }
};
