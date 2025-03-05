import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
}

interface Configuration {
    batch: Batch;
    item: string;
    type?: string;
    quantity?: number;
}

export const createAllConfigurations = async (
    configurations: Configuration[]
): Promise<Configuration[]> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(configurations),
        });

        if (!response.ok) {
            throw new Error("Failed to create configurations");
        }

        const responseData = await response.json();

        const data: Configuration[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating configurations:", error);
        throw error;
    }
};
