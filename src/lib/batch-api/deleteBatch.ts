import BASE_URL from "../../util/BaseUrl";

export const deleteBatch = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/batch/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete batch. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`Batch with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting batch:", error);
        return false;
    }
};
