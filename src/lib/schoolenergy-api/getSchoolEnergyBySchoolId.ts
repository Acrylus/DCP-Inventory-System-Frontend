import BASE_URL from "../../util/BaseUrl";

interface SchoolEnergy {
    schoolEnergyId: number;
    schoolRecordId: number;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

export const getSchoolEnergy = async (
    schoolRecordId: number
): Promise<SchoolEnergy | null> => {
    try {
        const response = await fetch(`${BASE_URL}/school/${schoolRecordId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

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
