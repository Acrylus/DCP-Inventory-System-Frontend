import BASE_URL from "../../util/BaseUrl";

interface SchoolBatchList {
    schoolBatchId: SchoolBatchList;
    batch: Batch;
    school: School;
    deliveryDate: string;
    numberOfPackages: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    package: Package;
}

interface School {
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    name: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: boolean;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
    designation?: string;
    previousStation?: string;
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
    packageId: number;
    item: string;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
    batch: Batch;
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
        const data: SchoolBatchList[] = responseData.data;

        console.log("Fetched SchoolBatchLists:", data);
        return data;
    } catch (error) {
        console.error("Error fetching schoolbatchlists:", error);
        throw error;
    }
};
