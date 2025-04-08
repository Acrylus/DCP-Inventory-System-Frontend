import BASE_URL from "../../util/BaseUrl";

interface Package {
    id: Id;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

interface Id {
    packageId: number;
    SchoolBatchListId: number;
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

interface SchoolBatchList {
    schoolBatchId: SchoolBatchList;
    deliveryDate: Date;
    numberOfPackages: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    package: Package;
}

export const getPackageBySchoolBatchListId = async (
    schoolBatchId: number
): Promise<Package[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/package/school_batch_list/${schoolBatchId}`,
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
                `Failed to fetch package by school batch list ID. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();
        const data: Package[] = responseData;

        console.log("Fetched Package by School Batch List ID:", data);
        return data;
    } catch (error) {
        console.error("Error fetching package by school batch list ID:", error);
        throw error;
    }
};
