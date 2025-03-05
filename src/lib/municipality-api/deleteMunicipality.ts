import BASE_URL from "../../util/BaseUrl";

export const deleteMunicipality = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/district/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.ok) {
            console.log("Municipality deleted successfully");
        } else {
            console.error(
                "Failed to delete municipality:",
                response.statusText
            );
        }
    } catch (error) {
        console.error("Error deleting municipality:", error);
    }
};
