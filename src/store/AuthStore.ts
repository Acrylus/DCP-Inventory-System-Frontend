import { useState, useEffect } from "react";

interface AuthState {
    userID: number;
    username: string;
    token: string | null;
}

export const useAuth = () => {
    const [auth, setAuth] = useState<AuthState>({
        userID: 0,
        username: "",
        token: null,
    });

    useEffect(() => {
        // Load auth state from localStorage on mount
        const storedToken = localStorage.getItem("authToken");
        const storedUserID = localStorage.getItem("authUserID");
        const storedUsername = localStorage.getItem("authUsername");

        if (storedToken && storedUserID && storedUsername) {
            setAuth({
                userID: parseInt(storedUserID, 10),
                username: storedUsername,
                token: storedToken,
            });
        }
    }, []);

    const setUser = (userID: number, username: string, token: string) => {
        localStorage.setItem("authUserID", userID.toString());
        localStorage.setItem("authUsername", username);
        localStorage.setItem("authToken", token);

        setAuth({ userID, username, token });
    };

    const logout = () => {
        localStorage.clear();

        setAuth({ userID: 0, username: "", token: null });
    };

    return { auth, setUser, logout };
};
