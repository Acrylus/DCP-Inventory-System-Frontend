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

export const getMunicipalities = async (): Promise<Municipality[]> => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch municipalities");
        }

        const responseData = await response.json();

        const data: Municipality[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching municipalities:", error);
        throw error;
    }
};
