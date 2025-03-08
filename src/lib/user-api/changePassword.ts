import BASE_URL from "../../util/BaseUrl";

export interface ChangePasswordPayload {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

export const changePassword = async (
    payload: ChangePasswordPayload,
    authToken: string
): Promise<boolean> => {
    if (!authToken) {
        console.error(
            "No authorization token found. Request will not be sent."
        );
        throw new Error("User not authenticated. Please log in.");
    }

    console.log(authToken);

    try {
        const response = await fetch(`${BASE_URL}/user/change_password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = "Failed to change password";
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
        console.error("Error changing password:", error);
        throw error;
    }
};
