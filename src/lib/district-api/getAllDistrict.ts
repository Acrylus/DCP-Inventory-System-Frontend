import BASE_URL from "../../util/BaseUrl";

interface District {
    districtId: number;
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

export const getAllDistricts = async (): Promise<District[]> => {
    try {
        const response = await fetch(`${BASE_URL}/district/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch districts");
        }

        const data: District[] = await response.json();
        console.log("Fetched Districts:", data);
        return data;
    } catch (error) {
        console.error("Error fetching districts:", error);
        throw error;
    }
};

getAllDistricts();
