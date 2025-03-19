import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    school: { schoolRecordId: number };
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

export const updateSchoolEnergy = async (
    schoolEnergyId: number,
    updatedData: Partial<SchoolEnergy>
): Promise<SchoolEnergy> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_energy/update/${schoolEnergyId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to update school energy record with ID: ${schoolEnergyId}`
            );
        }

        const responseData = await response.json();
        const data: SchoolEnergy = responseData.data;

        return data;
    } catch (error) {
        console.error("Error updating school energy record:", error);
        throw error;
    }
};
