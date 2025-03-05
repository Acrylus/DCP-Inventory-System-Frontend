import BASE_URL from "../../util/BaseUrl";

export const deleteSchoolById = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/school/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(
                `Failed to delete school. Status: ${response.status}, Message: ${errorMessage}`
            );
        }

        console.log(`School with ID ${id} deleted successfully.`);
        return true;
    } catch (error) {
        console.error("Error deleting school:", error);
        return false;
    }
};
