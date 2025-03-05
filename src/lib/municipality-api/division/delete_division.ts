import BASE_URL from "../../../util/BaseUrl";

export const deleteDivision = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/division/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete division");
        }

        console.log("Division deleted successfully");
    } catch (error) {
        console.error("Error deleting division:", error);
        throw error;
    }
};
