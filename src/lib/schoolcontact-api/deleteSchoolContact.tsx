import BASE_URL from "../../util/BaseUrl";

export const deleteSchoolContact = async (
    schoolContactId: number
): Promise<void> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_contact/delete/${schoolContactId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to delete school contact with ID: ${schoolContactId}`
            );
        }

        console.log(
            `School contact with ID ${schoolContactId} deleted successfully.`
        );
    } catch (error) {
        console.error("Error deleting school contact:", error);
        throw error;
    }
};
