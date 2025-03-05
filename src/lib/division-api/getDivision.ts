import BASE_URL from "../../util/BaseUrl";

interface Division {
    officeName: string;
    headOfOffice: string;
    position: string;
    itoName: string;
    emailAddress: string;
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

        const data = await response.json();
        console.log("Fetched division successfully:", data);
        return data as Division;
    } catch (error) {
        console.error("Error fetching division by ID:", error);
        throw error;
    }
};
