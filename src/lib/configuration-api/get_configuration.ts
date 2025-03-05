import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: string;
}

interface Configuration {
    item: string;
    type: string;
    quantity: string;
    batch: Batch;
}

export const getConfigurationById = async (
    id: number
): Promise<Configuration> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch configuration by ID");
        }

        const data = await response.json();
        console.log("Fetched configuration successfully:", data);
        return data as Configuration;
    } catch (error) {
        console.error("Error fetching configuration by ID:", error);
        throw error;
    }
};
