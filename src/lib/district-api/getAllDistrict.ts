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

export const getAllDistricts = async (): Promise<District[]> => {
    try {
        const response = await fetch(`${BASE_URL}/district/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch districts. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();

        const data: District[] = responseData.data;

        console.log("Fetched Districts:", data);
        return data;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
};
