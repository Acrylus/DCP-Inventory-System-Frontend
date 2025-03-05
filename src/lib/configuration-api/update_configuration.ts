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

export const updateConfiguration = async (
    id: number,
    configuration: Configuration
): Promise<Configuration> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(configuration),
        });

        if (!response.ok) {
            throw new Error("Failed to update configuration");
        }

        const data = await response.json();
        console.log("Configuration updated successfully:", data);
        return data as Configuration;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw error;
    }
};
