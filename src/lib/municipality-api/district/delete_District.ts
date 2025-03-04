import BASE_URL from "../../../util/BaseUrl";

interface DistrictDelete {
    name: string;
    division: {
        divisionId: number;
    };
}

export const deleteDistrict = async (
    id: number,
    district: DistrictDelete
): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/district/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(district),
        });
        if (!response.ok) {
            throw new Error("Failed to delete district");
        }
        console.log("District deleted successfully");
    } catch (error) {
        console.error("Error deleting district:", error);
        throw error;
    }
};

const districtToDelete: DistrictDelete = {
    name: "Alcantara TEST",
    division: {
        divisionId: 1,
    },
};

deleteDistrict(89, districtToDelete);
