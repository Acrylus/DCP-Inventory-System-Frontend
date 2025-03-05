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

        const data = await response.json();
        console.log("Configurations created successfully:", data);
        return data as Configuration[];
    } catch (error) {
        console.error("Error creating configurations:", error);
        throw error;
    }
};
