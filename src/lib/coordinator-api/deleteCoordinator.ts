import BASE_URL from "../../util/BaseUrl";

export const deleteCoordinator = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete coordinator. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`Coordinator with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting coordinator:", error);
        return false;
    }
};
