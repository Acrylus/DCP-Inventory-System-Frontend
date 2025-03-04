import { useState, useEffect } from "react";

interface Division {
    divisionId: number;
    officeName: string;
    headOfOffice: string;
    position: string;
    itoName: string;
    emailAddress: string;
    municipalityIds: number[]; // Store municipality IDs
    districtIds: number[]; // Store district IDs
}

export const useDivisionStore = () => {
    const [division, setDivision] = useState<Division>({
        divisionId: 0,
        officeName: "",
        headOfOffice: "",
        position: "",
        itoName: "",
        emailAddress: "",
        municipalityIds: [],
        districtIds: [],
    });

    useEffect(() => {
        const storedDivision = localStorage.getItem("division");
        if (storedDivision) {
            setDivision(JSON.parse(storedDivision));
        }
    }, []);

    const updateDivision = (newInfo: Partial<Division>) => {
        setDivision((prev) => {
            const updatedInfo = { ...prev, ...newInfo };
            localStorage.setItem("division", JSON.stringify(updatedInfo));
            return updatedInfo;
        });
    };

    const clearDivision = () => {
        localStorage.removeItem("division");
        setDivision({
            divisionId: 0,
            officeName: "",
            headOfOffice: "",
            position: "",
            itoName: "",
            emailAddress: "",
            municipalityIds: [],
            districtIds: [],
        });
    };

    return { division, updateDivision, clearDivision };
};
