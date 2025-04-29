import BASE_URL from "../../util/BaseUrl";

export interface ChangePasswordPayload {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

export const changePassword = async (
    payload: ChangePasswordPayload
): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/user/change_password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = "Failed to change password";

            try {
                const text = await response.text();
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.warn("Non-JSON error response received");
            }

            throw new Error(errorMessage);
        }

        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};
