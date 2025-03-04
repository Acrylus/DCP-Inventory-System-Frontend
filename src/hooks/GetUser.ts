import { useState } from "react";
import BASE_URL from "../util/BaseUrl"; // Adjust the import as necessary

export const useGetUser = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUser = async (userId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/user/get/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to fetch user");
            }

            const data = await response.json();
            console.log("User Data:", data); // Debugging log
            setUser(data);
        } catch (err) {
            setError((err as Error).message);
            console.error("Fetch user error:", err);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, getUser };
};
