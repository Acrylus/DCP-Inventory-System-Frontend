import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

export const createCoordinator = async (
    coordinator: Coordinator
): Promise<Coordinator> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(coordinator),
        });

        if (!response.ok) {
            throw new Error("Failed to create coordinator");
        }

        const data = await response.json();
        console.log("Coordinator created successfully:", data);
        return data as Coordinator;
    } catch (error) {
        console.error("Error creating coordinator:", error);
        throw error;
    }
};
