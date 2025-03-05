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

export const createConfiguration = async (
    configuration: Configuration
): Promise<Configuration> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(configuration),
        });

        if (!response.ok) {
            throw new Error("Failed to create configuration");
        }

        const responseData = await response.json();

        const data: Configuration = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating configuration:", error);
        throw error;
    }
};
