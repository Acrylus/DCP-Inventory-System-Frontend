// src/utils/authHelper.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../util/BaseUrl';  // Adjust the import as necessary

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
        idNumber: string,
        password: string
    ) => {
        event.preventDefault();
        
        if (!idNumber || !password) {
            setError("Please enter both ID number and password.");
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
                    username: idNumber,
                    password: password,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Login failed");
            }

            const data = await response.json();
            console.log("Login successful", data);
            navigate("/dashboard");

        } catch (err) {
            setError((err as Error).message);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, handleSubmit };
};
