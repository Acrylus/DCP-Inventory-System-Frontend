import BASE_URL from "../../util/BaseUrl";

export const deleteCoordinator = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/coordinator/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete coordinator");
        }

        console.log("Coordinator deleted successfully");
    } catch (error) {
        console.error("Error deleting coordinator:", error);
        throw error;
    }
};
