import BASE_URL from "../../util/BaseUrl";

export const deleteSchoolBatchListById = async (
  id: number
): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/school_batch_list/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to delete school batch list. Status: ${response.status}, Message: ${errorMessage}`
      );
    }

    console.log(`School Batch List with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting school batch list:", error);
    return false;
  }
};
