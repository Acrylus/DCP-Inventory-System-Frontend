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

interface SchoolBatchList {
    batch: Batch;
    school: School;
    deliveryDate: Date | null;
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

export const getPackageById = async (id: number): Promise<Package> => {
    try {
        const response = await fetch(`${BASE_URL}/package/get/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch package by ID");
        }

        const responseData = await response.json();

        const data: Package = responseData.data;

        return data;
    } catch (error) {
        console.error("Error fetching package by ID:", error);
        throw error;
    }
};
