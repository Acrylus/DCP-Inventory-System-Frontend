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

        const data = await response.json();
        console.log("Configuration created successfully:", data);
        return data as Configuration;
    } catch (error) {
        console.error("Error creating configuration:", error);
        throw error;
    }
};
