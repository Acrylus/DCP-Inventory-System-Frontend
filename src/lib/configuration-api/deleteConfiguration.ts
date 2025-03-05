import BASE_URL from "../../util/BaseUrl";

export const deleteConfiguration = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete configuration");
        }

        console.log("Configuration deleted successfully");
    } catch (error) {
        console.error("Error deleting configuration:", error);
        throw error;
    }
};
