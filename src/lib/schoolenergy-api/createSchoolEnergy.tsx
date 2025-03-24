import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    school: School;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
    type: string;
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

export const createMultipleSchoolEnergy = async (
    schoolEnergyRecords: SchoolEnergy[]
): Promise<SchoolEnergy[]> => {
    try {
        const response = await fetch(`${BASE_URL}/school_energy/create_all`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolEnergyRecords),
        });

        if (!response.ok) {
            throw new Error("Failed to create multiple school energy records");
        }

        const responseData = await response.json();
        const data: SchoolEnergy[] = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating multiple school energy records:", error);
        throw error;
    }
};
