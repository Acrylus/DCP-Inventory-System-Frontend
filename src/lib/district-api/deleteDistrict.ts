import BASE_URL from "../../util/BaseUrl";

export const deleteDistrict = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/district/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
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
