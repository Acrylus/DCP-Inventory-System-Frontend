import BASE_URL from "../../util/BaseUrl";

export const deleteConfiguration = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/configuration/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete configuration. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`Configuration with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting configuration:", error);
        return false;
    }
};
