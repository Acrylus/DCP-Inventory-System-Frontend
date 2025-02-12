import { useState } from "react";
import BASE_URL from "../util/BaseUrl"; // Adjust the import as necessary

export const useGetDivisions = () => {
    const [divisions, setDivisions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getDivisions = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${BASE_URL}/division/get_all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Failed to fetch divisions");
            }

            const data = await response.json();
            setDivisions(data?.data || []); // Assuming the response structure is { data: [] }
        } catch (err) {
            setError((err as Error).message);
            console.error("Fetch divisions error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return { divisions, isLoading, error, getDivisions };
};
