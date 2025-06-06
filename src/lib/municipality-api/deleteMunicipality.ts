import BASE_URL from "../../util/BaseUrl";

export const deleteMunicipality = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/municipality/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete municipality. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`Municipality with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting municipality:", error);
        return false;
    }
};
