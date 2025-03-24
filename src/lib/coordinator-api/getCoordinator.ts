import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    coordinatorId: number;
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

        const responseData = await response.json();

        const data: Coordinator = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching coordinator by ID:", error);
        throw error;
    }
};
