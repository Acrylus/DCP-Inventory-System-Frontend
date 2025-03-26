import BASE_URL from "../../util/BaseUrl";

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
}

interface Package {
    packageId: number;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    configuration: Configuration;
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
