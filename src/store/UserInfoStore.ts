import { useState, useEffect } from "react";

interface User {
    userId: number;
    referenceId: number;
    username: string;
    email: string;
    userType: string;
}

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User>(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser
            ? JSON.parse(storedUser)
            : {
                  userId: 0,
                  referenceId: 0,
                  username: "",
                  email: "",
                  userType: "",
              };
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            console.log(
                "Fetched userInfo from localStorage:",
                JSON.parse(storedUser)
            );
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    const updateUserInfo = (newInfo: Partial<User>) => {
        const updatedInfo = { ...userInfo, ...newInfo };
        localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
        setUserInfo(updatedInfo);
    };

    const clearUserInfo = () => {
        localStorage.removeItem("userInfo");
        setUserInfo({
            userId: 0,
            referenceId: 0,
            username: "",
            email: "",
            userType: "",
        });
    };

    return { userInfo, updateUserInfo, clearUserInfo };
};
