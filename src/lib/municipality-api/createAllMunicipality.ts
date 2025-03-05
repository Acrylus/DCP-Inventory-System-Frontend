import BASE_URL from "../../util/BaseUrl";

interface Municipality {
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

export const createMunicipalities = async (
    municipalities: Municipality[]
): Promise<Municipality[]> => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(municipalities),
        });

        if (!response.ok) {
            throw new Error("Failed to create municipalities");
        }

        const responseData = await response.json();

        const data: Municipality[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating municipalities:", error);
        throw error;
    }
};
