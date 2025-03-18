import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
}

interface Division {
    divisionId: number;
    batch: Batch;
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

        const data = await response.json();
        console.log("Fetched division successfully:", data);
        return data as Division;
    } catch (error) {
        console.error("Error fetching division by ID:", error);
        throw error;
    }
};
