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

export const getAllConfigurations = async (): Promise<Configuration[]> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch configurations. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();

        const data: Configuration[] = responseData.data;

        console.log("Fetched Configurations:", data);
        return data;
    } catch (error) {
        console.error("Error fetching configurations:", error);
        throw error;
    }
};

// Example usage:
getAllConfigurations().then((configurations) =>
    console.log("All Configurations Retrieved:", configurations)
);
