import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

export const updateCoordinator = async (
    id: number,
    coordinator: Coordinator
): Promise<Coordinator> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(coordinator),
        });

        if (!response.ok) {
            throw new Error("Failed to update coordinator");
        }

        const responseData = await response.json();

        const data: Coordinator = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating coordinator:", error);
        throw error;
    }
};
