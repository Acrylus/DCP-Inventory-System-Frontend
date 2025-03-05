import BASE_URL from "../../util/BaseUrl";

interface Coordinator {
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

export const getAllCoordinators = async (): Promise<Coordinator[]> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch coordinators");
        }

        const responseData = await response.json();

        const data: Coordinator[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching coordinators:", error);
        throw error;
    }
};
