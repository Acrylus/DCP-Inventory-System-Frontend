import BASE_URL from "../../util/BaseUrl";

interface District {
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

export const createAllDistricts = async (
    districts: District[]
): Promise<District[]> => {
    try {
        const response = await fetch(`${BASE_URL}/district/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(districts),
        });
        if (!response.ok) {
            throw new Error("Failed to create districts");
        }

        const responseData = await response.json();

        const data: District[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating districts:", error);
        throw error;
    }
};
