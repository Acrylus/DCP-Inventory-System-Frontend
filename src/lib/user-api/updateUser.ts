import BASE_URL from "../../util/BaseUrl";

export interface UpdateUserPayload {
    username?: string;
    email?: string;
}

export const updateUser = async (
    userId: number,
    payload: UpdateUserPayload,
    authToken: string
): Promise<boolean> => {
    if (!authToken) {
        console.error(
            "No authorization token found. Request will not be sent."
        );
        throw new Error("User not authenticated. Please log in.");
    }

    try {
        const response = await fetch(`${BASE_URL}/user/update/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = "Failed to update user details";
            try {
                const errorData = await response.text();
                console.warn("Server response:", errorData);
                errorMessage = errorData || errorMessage;
            } catch (e) {
                console.warn("No valid response body or invalid format", e);
            }
            throw new Error(errorMessage);
        }

        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
