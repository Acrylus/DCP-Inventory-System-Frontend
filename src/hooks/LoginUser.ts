import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../util/BaseUrl"; // Adjust the import as necessary
import { useAuth } from "../store/AuthStore"; // Import Auth store
import { useUserInfo } from "../store/UserInfoStore"; // Import User Info store

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { setUser } = useAuth(); // Auth store function to save user details and token
    const { updateUserInfo } = useUserInfo(); // Use updateUserInfo instead of individual setters

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
        email: string,
        password: string
    ) => {
        event.preventDefault();

        if (!email || !password) {
            setError("Please enter both username and password.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Login failed");
            }

            const responseData = await response.json();
            console.log("API Response:", responseData);

            const userData = responseData.data;

            if (!userData || !userData.user.userId) {
                throw new Error("Invalid response: userId is missing");
            }

            setUser(
                userData.user.userId.toString(),
                userData.username,
                userData.token
            );

            console.log("Storing in User Info Store:", userData.user);

            updateUserInfo(userData.user);

            console.log("Login successful", userData);
            navigate(`/${userData.user.userType}-dashboard`);
        } catch (err) {
            let errorMessage = "An unexpected error occurred";
            try {
                const parsed = JSON.parse((err as Error).message);
                errorMessage = parsed.message;
            } catch {
                errorMessage = (err as Error).message;
            }
            setError(errorMessage);
            console.error("Login error:", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleSubmit };
};
