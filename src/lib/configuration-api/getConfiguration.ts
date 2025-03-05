import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
}

interface Configuration {
    configurationId: number;
    batch: Batch;
    item: string;
    type?: string;
    quantity?: number;
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

        const responseData = await response.json();

        const data: Configuration = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching configuration by ID:", error);
        throw error;
    }
};
