import BASE_URL from "../../util/BaseUrl";

export const deleteConfiguration = async (
    configurationId: number,
    batchId: number
): Promise<boolean> => {
    try {
        const response = await fetch(
            `${BASE_URL}/configuration/delete/${configurationId}/batch/${batchId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error(
                `Failed to delete configuration. Status: ${response.status}, Message: ${errorMessage}`
            );
            return false;
        }

        console.log(
            `Configuration with ID ${configurationId} for Batch ${batchId} deleted successfully.`
        );
        return true;
    } catch (error) {
        console.error("Error deleting configuration:", error);
        return false;
    }
};
