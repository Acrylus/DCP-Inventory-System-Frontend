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

export const getConfigurationByBatchId = async (
    batchId: number
): Promise<Configuration[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/configuration/batch/${batchId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch configuration by batch ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: Configuration[] = responseData;

        console.log("Fetched Configuration by Batch ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching configuration by batch ID:", error);
        throw error;
    }
};
