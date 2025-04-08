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
export const createSchoolEnergy = async (
    schoolEnergy: SchoolEnergy
): Promise<SchoolEnergy> => {
    try {
        const response = await fetch(`${BASE_URL}/school_energy/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolEnergy),
        });

        if (!response.ok) {
            throw new Error("Failed to create school energy record");
        }

        const responseData = await response.json();
        const data: SchoolEnergy = responseData.data;

        return data;
    } catch (error) {
        console.error("Error creating school energy record:", error);
        throw error;
    }
};
