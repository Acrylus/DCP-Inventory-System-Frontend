import BASE_URL from "../../util/BaseUrl";

export const deleteDivision = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/division/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete division. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(`Division with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting division:", error);
        return false;
    }
};
