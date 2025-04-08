import BASE_URL from "../../util/BaseUrl";

export interface UpdateUserPayload {
    username?: string;
    email?: string;
}

export const updateUser = async (
    userId: number,
    payload: UpdateUserPayload
): Promise<boolean> => {
    if (!payload.username && !payload.email) {
        console.warn("No changes to update.");
        return false;
    }

    try {
        const response = await fetch(`${BASE_URL}/user/update/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log(payload);

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
