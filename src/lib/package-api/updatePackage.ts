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
    division: Division;
    name: string;
}

interface Batch {
    batchId: number;
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
    id: ConfigurationId;
    item: string;
    type: string;
    quantity: number;
}

interface ConfigurationId {
    configurationId: number;
    batchId: number;
}

export const updatePackage = async (packages: Package): Promise<Package> => {
    try {
        const response = await fetch(
            `${BASE_URL}/package/update/${packages.id.packageId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packages),
            }
        );
        if (!response.ok) {
            throw new Error("Failed to update package");
        }

        const responseData = await response.json();

        const data: Package = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating package:", error);
        throw error;
    }
};
