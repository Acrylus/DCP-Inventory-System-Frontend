import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchName: string;
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
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
