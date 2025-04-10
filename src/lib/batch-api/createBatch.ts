import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    configurations: Configuration[];
}

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

export const createBatch = async (batch: Batch): Promise<Batch> => {
    try {
        const response = await fetch(`${BASE_URL}/batch/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(batch),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to create batch: ${errorMessage}`);
        }

        const responseData = await response.json();

        const data: Batch = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating batch:", error);
        throw error;
    }
};
