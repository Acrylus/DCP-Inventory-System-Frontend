import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    school: { schoolRecordId: number };
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
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
