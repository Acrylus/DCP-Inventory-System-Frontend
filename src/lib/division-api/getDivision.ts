import BASE_URL from "../../util/BaseUrl";

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

export const getDivisionById = async (id: number): Promise<Division> => {
    try {
        const response = await fetch(`${BASE_URL}/division/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch division by ID");
        }

        const responseData = await response.json();
        const data: Division = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching division by ID:", error);
        throw error;
    }
};
