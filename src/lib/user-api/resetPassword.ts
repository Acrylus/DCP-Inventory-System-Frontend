import BASE_URL from "../../util/BaseUrl";

export interface ResetPasswordResponse {
    message: string;
    status: string;
}

export const resetPassword = async (
    schoolRecordId: number
): Promise<ResetPasswordResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/user/reset_password/${schoolRecordId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to reset password");
        }

        return data as ResetPasswordResponse;
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};
