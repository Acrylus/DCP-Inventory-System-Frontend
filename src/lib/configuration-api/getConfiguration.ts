import BASE_URL from "../../util/BaseUrl";

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
    batch: Batch
}

interface Batch {
    batchId: number;
    batchName: string;
    batchYear: string;
    deliveryYear: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
}

export const getConfigurationById = async (id: number): Promise<Configuration> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch configurationo");
        }

        const data: Configuration = await response.json();
        console.log("Fetched Configuration:", data);
        return data;
    } catch (error) {
        console.error("Error fetching configuration:", error);
        throw error;
    }
};

getConfigurationById(1);
