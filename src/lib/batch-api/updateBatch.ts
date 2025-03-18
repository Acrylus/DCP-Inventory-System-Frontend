import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configuration: Configuration[];
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

export const updateBatch = async (batch: Batch): Promise<Batch> => {
    try {
        const response = await fetch(
            `${BASE_URL}/batch/update/${batch.batchId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(batch),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update batch");
        }

        const responseData = await response.json();

        const data: Batch = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating batch:", error);
        throw error;
    }
};
