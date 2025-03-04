import BASE_URL from "../../../util/BaseUrl";

interface District {
    name: string;
    division: {
        divisionId: number;
    };
}

export const getDistrictById = async (id: number): Promise<District> => {
    try {
        const response = await fetch(`${BASE_URL}/district/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch district");
        }

        const data: District = await response.json();
        console.log("Fetched District:", data);
        return data;
    } catch (error) {
        console.error("Error fetching district:", error);
        throw error;
    }
};

getDistrictById(89);
