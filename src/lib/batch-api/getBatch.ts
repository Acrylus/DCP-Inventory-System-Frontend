import BASE_URL from "../../util/BaseUrl";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    configurations: Configuration[];
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

export const getBatchById = async (id: number): Promise<Batch | null> => {
    try {
        const response = await fetch(`${BASE_URL}/batch/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to fetch batch with ID ${id}. Status: ${response.status}, Message: ${errorMessage}`
            );
            return null;
        }

        const responseData = await response.json();
        const data: Batch = responseData.data;

        console.log(`Batch with ID ${id} fetched successfully:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching batch with ID ${id}:`, error);
        return null;
    }
};
