import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    schoolEnergyId: number;
    school: School;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

interface School {
    schoolRecordId: number;
    division: Division;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
    coordinators: Coordinator[];
}

interface Coordinator {
    coordinatorId: number;
    schoolId: number;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
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

export const getSchoolEnergyById = async (
    schoolEnergyId: number
): Promise<SchoolEnergy> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_energy/get/${schoolEnergyId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch school energy record");
        }

        const responseData = await response.json();
        return responseData.data as SchoolEnergy;
    } catch (error) {
        console.error("Error fetching school energy record:", error);
        throw error;
    }
};
