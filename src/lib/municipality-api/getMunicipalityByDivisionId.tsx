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

export const getMunicipalityByDivisionId = async (
    divisionId: number
): Promise<Municipality[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/municipality/division/${divisionId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch municipality by division ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: Municipality[] = responseData;

        console.log("Fetched Municipality by Division ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching municipality by division ID:", error);
        throw error;
    }
};
