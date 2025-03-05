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

export const updateConfiguration = async (
    configuration: Configuration
): Promise<Configuration> => {
    try {
        const response = await fetch(
            `${BASE_URL}/configuration/update/${configuration.configurationId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(configuration),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update configuration");
        }

        const responseData = await response.json();

        const data: Configuration = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating configuration:", error);
        throw error;
    }
};
