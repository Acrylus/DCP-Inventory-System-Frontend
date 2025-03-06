import { useState, useEffect } from "react";

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
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    name: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: boolean;
    localGridSupply?: boolean;
    connectivity?: boolean;
    smart?: boolean;
    globe?: boolean;
    digitalNetwork?: boolean;
    am?: boolean;
    fm?: boolean;
    tv?: boolean;
    cable?: boolean;
    ntcRemark?: string;
    designation?: string;
    previousStation?: string;
}

interface District {
    districtId: number;
    name: string;
    division: Division;
}

interface Division {
    divisionId: number;
    division: string;
    title: string;
    sdsName: string;
    sdsPosition: string;
    itoName: string;
    itoEmail: string;
}

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User>(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser
            ? JSON.parse(storedUser)
            : {
                  userId: 0,
                  division: null,
                  district: null,
                  school: null,
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
            division: null,
            district: null,
            school: null,
            username: "",
            email: "",
            userType: "",
        });
    };

    return { userInfo, updateUserInfo, clearUserInfo };
};
