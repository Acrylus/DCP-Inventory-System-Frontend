import { useState, useEffect } from "react";
import BASE_URL from "../util/BaseUrl";

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

interface User {
    userId: number;
    division: Division | null;
    district: District | null;
    school: School | null;
    username: string;
    email: string;
    userType: string;
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
}

export const useGetUser = (userId?: number) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const getUser = async () => {
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
                console.log("Fetched User Data:", data);
                setUser(data);
            } catch (err) {
                setError((err as Error).message);
                console.error("Fetch user error:", err);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [userId]);

    return { user, loading, error };
};
