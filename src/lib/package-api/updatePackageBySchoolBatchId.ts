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
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configurations: Configuration[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: Date;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
    packages: Package[];
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
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

export const updatePackagesBySchoolBatch = async (
    schoolBatchId: number,
    packages: Package[]
): Promise<Package[]> => {
    try {
        const response = await fetch(
            `${BASE_URL}/package/update/school_batch/${schoolBatchId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packages),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update packages");
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error updating packages:", error);
        throw error;
    }
};
