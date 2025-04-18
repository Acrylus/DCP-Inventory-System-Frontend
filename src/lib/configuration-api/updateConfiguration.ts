import BASE_URL from "../../util/BaseUrl";

interface Configuration {
    id: ConfigurationId;
    item: string;
    type: string;
    quantity: number;
}

interface ConfigurationId {
    configurationId: number;
    batchId: number;
}

export const updateConfiguration = async (
    configuration: Configuration
): Promise<Configuration> => {
    try {
        const { configurationId, batchId } = configuration.id;
        const response = await fetch(
            `${BASE_URL}/configuration/update/${configurationId}/batch/${batchId}`, // Ensure the URL follows the backend format
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(configuration), // Sending the full configuration object
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
