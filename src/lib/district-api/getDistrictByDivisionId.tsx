import BASE_URL from "../../util/BaseUrl";

interface District {
    districtId: number;
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

export const getDistrictByDivisionId = async (
    divisionId: number
): Promise<District[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/district/division/${divisionId}`,
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
                `Failed to fetch district by division ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: District[] = responseData;

        console.log("Fetched District by Division ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching district by division ID:", error);
        throw error;
    }
};
