import BASE_URL from "../../util/BaseUrl";

export const deleteDistrict = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/district/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete district. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`District with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting district:", error);
        return false;
    }
};
