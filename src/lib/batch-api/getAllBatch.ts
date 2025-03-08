import BASE_URL from "../../util/BaseUrl";

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    schoolBatchList: SchoolBatchList[];
    configurations: Configuration[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    deliveryDate: number;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
}

export const getAllBatches = async (): Promise<Batch[]> => {
    try {
        const response = await fetch(`${BASE_URL}/batch/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to fetch batches. Status: ${response.status}, Message: ${errorMessage}`
            );
            throw new Error("Failed to fetch batches");
        }

        const responseData = await response.json();
        const data: Batch[] = responseData.data;

        console.log("Batches fetched successfully:", data);
        return data;
    } catch (error) {
        console.error("Error fetching batches:", error);
        throw error;
    }
};
