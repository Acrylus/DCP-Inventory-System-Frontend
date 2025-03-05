import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

export const getCoordinatorById = async (id: number): Promise<Coordinator> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch coordinator by ID");
        }

        const data = await response.json();
        console.log("Fetched coordinator successfully:", data);
        return data as Coordinator;
    } catch (error) {
        console.error("Error fetching coordinator by ID:", error);
        throw error;
    }
};
