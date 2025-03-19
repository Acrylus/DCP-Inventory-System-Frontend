import BASE_URL from "../../util/BaseUrl";

export const deleteSchoolNTC = async (schoolNTCId: number): Promise<void> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_ntc/delete/${schoolNTCId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to delete school NTC record with ID: ${schoolNTCId}`
            );
        }

        console.log(
            `School NTC record with ID ${schoolNTCId} deleted successfully.`
        );
    } catch (error) {
        console.error("Error deleting school NTC record:", error);
        throw error;
    }
};
