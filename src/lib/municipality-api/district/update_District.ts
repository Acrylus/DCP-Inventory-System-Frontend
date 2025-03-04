import BASE_URL from "../../../util/BaseUrl";

interface DistrictUpdate {
    name: string;
    division: {
        divisionId: number;
    };
}

export const updateDistrict = async (
    id: number,
    district: DistrictUpdate
): Promise<DistrictUpdate> => {
    try {
        const response = await fetch(`${BASE_URL}/district/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(district),
        });
        if (!response.ok) {
            throw new Error("Failed to update district");
        }

        const data: DistrictUpdate = await response.json();
        console.log("District updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating district:", error);
        throw error;
    }
};

const updatedDistrict: DistrictUpdate = {
    name: "Alcantara TEST",
    division: {
        divisionId: 1,
    },
};

updateDistrict(89, updatedDistrict);
