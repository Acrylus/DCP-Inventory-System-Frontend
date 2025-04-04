import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchName: string;
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configurations: Configuration[];
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

export const createAllBatches = async (batches: Batch[]): Promise<Batch[]> => {
    try {
        const response = await fetch(`${BASE_URL}/batch/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(batches),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to create batches: ${errorMessage}`);
        }

        const responseData = await response.json();

        const data: Batch[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating batches:", error);
        throw error;
    }
};
