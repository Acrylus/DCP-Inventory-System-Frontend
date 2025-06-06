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

export const getSchoolEnergy = async (
    schoolRecordId: number
): Promise<SchoolEnergy | null> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_energy/school/${schoolRecordId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch school energy data");
        }

        const data: SchoolEnergy = await response.json(); // Assuming the API returns a single object

        return data;
    } catch (error) {
        console.error("Error fetching school energy data:", error);
        return null; // Return null in case of error instead of throwing
    }
};
