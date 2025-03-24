import BASE_URL from "../../util/BaseUrl";

export const deletePackage = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/package/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(
        `Failed to delete package. Status: ${response.status}, Message: ${errorMessage}`
      );
      return false;
    }

    console.log(`Package with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting package:", error);
    return false;
  }
};
