import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    schoolEnergyId: number;
    school: School;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
    type: string;
}

interface School {
    schoolRecordId: number;
    division: Division;
    district: District;
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
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
