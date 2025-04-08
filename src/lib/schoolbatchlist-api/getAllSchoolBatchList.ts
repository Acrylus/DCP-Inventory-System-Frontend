import BASE_URL from "../../util/BaseUrl";

interface SchoolBatchList {
    schoolBatchId: SchoolBatchList;
    batch: Batch;
    school: School;
    deliveryDate: Date;
    numberOfPackages: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    package: Package;
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    email: string;
    name: string;
    address: string;
    previousStation: string;
}

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
}

interface Batch {
    batchId: number;
    batchName: string;
    batchYear: string;
    deliveryYear: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configuration: Configuration;
}

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

export const getAllSchoolBatchLists = async (): Promise<SchoolBatchList[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_batch_list/get_all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to fetch schoolbatchlists. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        const responseData = await response.json();

        // Extract the data array from the response
        const data: SchoolBatchList[] = responseData;

        console.log("Fetched SchoolBatchLists:", data);
        return data;
    } catch (error) {
        console.error("Error fetching schoolbatchlists:", error);
        throw error;
    }
};
