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
}

interface District {
    districtId: number;
}

interface Batch {
    batchId: number;
}

interface Configuration {
    configurationId: number;
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
