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
