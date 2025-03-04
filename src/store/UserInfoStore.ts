import { useState, useEffect } from "react";

interface UserInfo {
    userId: number;
    divisionId: number | null;
    districtId: number | null;
    schoolId: number | null;
    username: string;
    email: string;
    userType: string;
}

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfo>(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser
            ? JSON.parse(storedUser)
            : {
                  userId: 0,
                  divisionId: null,
                  districtId: null,
                  schoolId: null,
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

    const updateUserInfo = (newInfo: Partial<UserInfo>) => {
        const updatedInfo = { ...userInfo, ...newInfo };
        localStorage.setItem("userInfo", JSON.stringify(updatedInfo));
        setUserInfo(updatedInfo);
    };

    const clearUserInfo = () => {
        localStorage.removeItem("userInfo");
        setUserInfo({
            userId: 0,
            divisionId: null,
            districtId: null,
            schoolId: null,
            username: "",
            email: "",
            userType: "",
        });
    };

    return { userInfo, updateUserInfo, clearUserInfo };
};
