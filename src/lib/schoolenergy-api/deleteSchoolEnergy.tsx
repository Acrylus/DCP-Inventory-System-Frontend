import BASE_URL from "../../util/BaseUrl";

export const deleteSchoolEnergy = async (
    schoolEnergyId: number
): Promise<void> => {
    try {
        const response = await fetch(
            `${BASE_URL}/school_energy/delete/${schoolEnergyId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to delete school energy record with ID: ${schoolEnergyId}`
            );
        }

        console.log(
            `School energy record with ID ${schoolEnergyId} deleted successfully.`
        );
    } catch (error) {
        console.error("Error deleting school energy record:", error);
        throw error;
    }
};
