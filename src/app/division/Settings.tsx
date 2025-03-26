import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
} from "@material-tailwind/react";
import {
    Cog6ToothIcon,
    UserCircleIcon,
    Square3Stack3DIcon,
    UserIcon,
    BoltIcon,
    SignalIcon,
} from "@heroicons/react/24/solid";
import { getMunicipalities } from "../../lib/municipality-api/getAllMunicipality";
import { useUserInfo } from "../../store/UserInfoStore";
import { Card, CardBody } from "@material-tailwind/react";
import { changePassword } from "../../lib/user-api/changePassword";
import { useAuth } from "../../store/AuthStore";
import { getDivisionById } from "../../lib/division-api/getDivision";
import { getSchoolById } from "../../lib/school-api/getSchool";
import { getSchoolContact } from "../../lib/schoolcontact-api/getSchoolContactBySchoolId";
import { getSchoolEnergy } from "../../lib/schoolenergy-api/getSchoolEnergyBySchoolId";
import { getSchoolNTC } from "../../lib/schoolntc-api/getSchoolNTCBySchoolId";
import { getAllDistricts } from "../../lib/district-api/getAllDistrict";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { updateSchoolContact } from "../../lib/schoolcontact-api/updateSchoolContact";
import { updateSchoolEnergy } from "../../lib/schoolenergy-api/updateSchoolEnergy";
import { updateSchoolNTC } from "../../lib/schoolntc-api/updateSchoolNTC";
import { updateSchoolById } from "../../lib/school-api/updateSchool";
import { updateUser } from "../../lib/user-api/updateUser";
import { updateDivision } from "../../lib/division-api/updateDivision";

interface Municipality {
    municipalityId: number;
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

interface District {
    districtId: number;
    name: string;
    division: Division;
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

interface SchoolContact {
    schoolContactId: number;
    school: School;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
    coordinators: Coordinator[];
}

interface Coordinator {
    coordinatorId: number;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

interface SchoolEnergy {
    schoolEnergyId: number;
    school: School;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
    type: string;
}

interface SchoolNTC {
    schoolNTCId: number;
    school: School;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
    providers: Provider[];
}

interface Provider {
    providerId: number;
    name: string;
    speed: number;
    unit: string;
}

export interface ChangePasswordPayload {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

const unitOptions = ["kbps", "mbps", "gbps"];

const classificationOptions = [
    "Primary (K-3)",
    "Elementary",
    "Secondary (JHS/SHS)",
    "JHS",
    "SHS",
    "Integrated School",
];

const internetProviders = [
    "PLDT",
    "Globe",
    "Smart",
    "Sky Broadband",
    "Converge",
    "Eastern Communications",
    "Dito Telecommunity",
    "Royal Cable",
    "PLDT Home",
    "InfiniVAN",
    "Broadband Everywhere",
    "Red Fiber",
    "Digitel",
    "Streamtech",
    "Starlink",
];

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useUserInfo();
    const { auth } = useAuth();

    const [division, setDivision] = useState<Division | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schoolContact, setSchoolContact] = useState<SchoolContact | null>(
        null
    );
    const [schoolEnergy, setSchoolEnergy] = useState<SchoolEnergy | null>(null);
    const [schoolNTC, setSchoolNTC] = useState<SchoolNTC | null>(null);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    type PasswordField = "oldPassword" | "newPassword" | "confirmNewPassword";

    const handleInputChange = (field: PasswordField, value: string) => {
        setPasswordData((prev) => ({ ...prev, [field]: value }));
    };

    const [activeSchoolTab, setActiveSchoolTab] = useState<string>("Profile");

    const [newProviderName, setNewProviderName] = useState("");
    const [newProviderSpeed, setNewProviderSpeed] = useState(0);
    const [newProviderUnit, setNewProviderUnit] = useState("");

    const [newCoordinator, setNewCoordinator] = useState<Coordinator>({
        coordinatorId: 0,
        name: "",
        designation: "",
        email: "",
        number: "",
        remarks: "",
    });

    const handleUpdateSchool = async () => {
        try {
            console.log("Active Tab:", activeSchoolTab);

            if (activeSchoolTab === "Profile" && school) {
                console.log("Updating School:", school);
                await updateSchoolById(school);
                console.log("School updated successfully");
            }

            if (activeSchoolTab === "Contact" && schoolContact) {
                console.log("Updating School:", schoolContact);
                await updateSchoolContact(
                    schoolContact.schoolContactId,
                    schoolContact
                );
                console.log("School contact updated successfully");
            }

            if (activeSchoolTab === "Energized" && schoolEnergy) {
                await updateSchoolEnergy(
                    schoolEnergy.schoolEnergyId,
                    schoolEnergy
                );
                console.log("School energy updated successfully");
            }

            if (activeSchoolTab === "NTC" && schoolNTC) {
                await updateSchoolNTC(schoolNTC.schoolNTCId, schoolNTC);
                console.log("School NTC updated successfully");
            }
        } catch (error) {
            console.error("Error updating school:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userInfo?.userType === "division") {
                    const divisionData = await getDivisionById(
                        userInfo.referenceId
                    );
                    setDivision(divisionData);
                } else if (userInfo?.userType === "school") {
                    const schoolData = await getSchoolById(
                        userInfo.referenceId
                    );
                    setSchool(schoolData);

                    if (schoolData) {
                        const schoolContactData = await getSchoolContact(
                            schoolData.schoolRecordId
                        );
                        setSchoolContact(schoolContactData);

                        const schoolEnergyData = await getSchoolEnergy(
                            schoolData.schoolRecordId
                        );
                        setSchoolEnergy(schoolEnergyData);

                        const schoolNTCData = await getSchoolNTC(
                            schoolData.schoolRecordId
                        );
                        setSchoolNTC(schoolNTCData);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (userInfo?.referenceId) {
            fetchData();
        }
    }, [userInfo?.userType, userInfo?.referenceId]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [municipalitiesData, districtsData] = await Promise.all([
                getMunicipalities(),
                getAllDistricts(),
            ]);

            setMunicipalities(municipalitiesData);
            setDistricts(districtsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault(); // Prevent page reload

        if (!auth?.token || !auth?.userID) {
            setSnackbarMessage("User not authenticated. Please log in.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        const { oldPassword, newPassword, confirmNewPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setSnackbarMessage("All fields are required.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        if (newPassword.length < 8) {
            setSnackbarMessage(
                "New password must be at least 8 characters long."
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setSnackbarMessage("New passwords do not match.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        try {
            const payload: ChangePasswordPayload = {
                userId: auth.userID,
                oldPassword,
                newPassword,
            };

            await changePassword(payload, auth.token);
            setSnackbarMessage("Password changed successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);

            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (error: any) {
            setSnackbarMessage(`Failed to change password: ${error.message}`);
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleRemoveCoordinator = (index: number) => {
        setSchoolContact((prev) => ({
            ...prev!,
            coordinators: prev!.coordinators.filter((_, i) => i !== index),
        }));
    };

    const handleAddCoordinator = () => {
        if (
            !newCoordinator.name ||
            !newCoordinator.designation ||
            !newCoordinator.email ||
            !newCoordinator.number
        ) {
            console.error("Invalid coordinator data");
            return;
        }

        const newCoordinatorData = {
            coordinatorId: Date.now(), // Unique ID
            name: newCoordinator.name,
            designation: newCoordinator.designation,
            email: newCoordinator.email,
            number: newCoordinator.number,
            remarks: newCoordinator.remarks || "",
        };

        setSchoolContact((prev) => ({
            ...prev!,
            coordinators: [...(prev?.coordinators || []), newCoordinatorData], // Ensure immutability
        }));

        // Reset input fields
        setNewCoordinator({
            coordinatorId: 0,
            name: "",
            designation: "",
            email: "",
            number: "",
            remarks: "",
        });
    };

    const handleCoordinatorChange = (
        index: number,
        field: keyof Coordinator,
        value: string
    ) => {
        setSchoolContact((prev) => ({
            ...prev!,
            coordinators: prev!.coordinators.map((coordinator, i) =>
                i === index ? { ...coordinator, [field]: value } : coordinator
            ),
        }));
    };

    const handleRemoveProvider = (index: number) => {
        setSchoolNTC((prev) => ({
            ...prev!,
            providers: prev!.providers.filter((_, i) => i !== index),
        }));
    };

    const handleAddProvider = () => {
        if (!newProviderName || !newProviderUnit || isNaN(newProviderSpeed)) {
            console.error("Invalid provider data");
            return;
        }

        const newProvider: Provider = {
            providerId: Date.now(), // Unique ID
            name: newProviderName,
            speed: newProviderSpeed,
            unit: newProviderUnit,
        };

        setSchoolNTC((prev) => ({
            ...prev!,
            providers: [...(prev?.providers || []), newProvider], // Ensure immutability
        }));

        // Reset input fields
        setNewProviderName("");
        setNewProviderSpeed(0);
        setNewProviderUnit("");
    };

    const [formData, setFormData] = useState({
        username: userInfo?.username || "",
        email: userInfo?.email || "",
    });

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(`Updating ${name} to:`, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateUser = async () => {
        console.log("Form Data before update:", formData);
        if (!auth.token) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        try {
            const success = await updateUser(
                userInfo.userId,
                formData,
                auth.token
            );
            if (success) alert("User updated successfully!");
        } catch (error) {
            if (error instanceof Error) {
                alert("Failed to update user: " + error.message);
            } else {
                alert("An unknown error occurred.");
            }
        }
    };

    const handleDivisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setDivision((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleUpdateDivision = async () => {
        try {
            if (division == null) {
                throw new Error("No division data available");
            }

            const updatedDivision = await updateDivision(division);
            console.log("Division updated successfully:", updatedDivision);
            setDivision(updatedDivision);
            alert("Division updated successfully!");
        } catch (error) {
            console.error("Error updating division:", error);
            alert("Failed to update division.");
        }
    };

    const TabData = [
        {
            label: "Profile",
            value: "Profile",
            icon: UserIcon,
            content: (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* School Record ID */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            School Record ID:
                        </label>
                        <input
                            type="text"
                            value={school?.schoolRecordId || ""}
                            onChange={(e) =>
                                setSchool({
                                    ...school!,
                                    schoolRecordId: parseInt(
                                        e.target.value,
                                        10
                                    ),
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* School ID */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            School ID:
                        </label>
                        <input
                            type="text"
                            value={school?.schoolId || ""}
                            onChange={(e) =>
                                setSchool({
                                    ...school!,
                                    schoolId: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Division */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Division:
                        </label>
                        <input
                            type="text"
                            value={school?.district.division.division || ""}
                            readOnly
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* District */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            District:
                        </label>
                        <select
                            value={school?.district?.name || ""}
                            onChange={(e) =>
                                setSchool({
                                    ...school!,
                                    district: {
                                        ...school!.district,
                                        name: e.target.value,
                                    },
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="" disabled>
                                Select District
                            </option>
                            {districts.map((district) => (
                                <option
                                    key={district.districtId}
                                    value={district.name}
                                >
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* School Name */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            School Name:
                        </label>
                        <input
                            type="text"
                            value={school?.name || ""}
                            onChange={(e) =>
                                setSchool({
                                    ...school!,
                                    name: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Classification */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            Classification:
                        </label>
                        <select
                            value={school?.classification || ""}
                            onChange={(e) => {
                                setSchool((prevState) => {
                                    // Make sure prevState is not null before attempting to update it
                                    if (prevState) {
                                        return {
                                            ...prevState,
                                            classification: e.target.value,
                                        };
                                    }
                                    return prevState; // If prevState is null, return it as is
                                });
                            }}
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="" disabled>
                                Select Classification
                            </option>
                            {classificationOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                            {/* Add more classification options here as needed */}
                        </select>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            Address:
                        </label>
                        <textarea
                            value={school?.address || ""}
                            onChange={(e) =>
                                setSchool({
                                    ...school!,
                                    address: e.target.value,
                                })
                            }
                            className="h-20 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        ></textarea>
                    </div>
                </div>
            ),
        },
        {
            label: "Contact",
            value: "Contact",
            icon: Square3Stack3DIcon,
            content: (
                <div className="p-6 grid gap-6">
                    {/* Landline */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Landline:
                        </label>
                        <input
                            type="text"
                            value={schoolContact?.landline || ""}
                            onChange={(e) =>
                                setSchoolContact({
                                    ...schoolContact!,
                                    landline: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Columns for School Head and Property Custodian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* School Head Column */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">
                                School Head:
                            </label>
                            <input
                                type="text"
                                value={schoolContact?.schoolHead || ""}
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        schoolHead: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                            <label className="text-sm font-medium text-gray-600 mt-4">
                                School Head Number:
                            </label>
                            <input
                                type="text"
                                value={schoolContact?.schoolHeadNumber || ""}
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        schoolHeadNumber: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                            <label className="text-sm font-medium text-gray-600 mt-4">
                                School Head Email:
                            </label>
                            <input
                                type="email"
                                value={schoolContact?.schoolHeadEmail || ""}
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        schoolHeadEmail: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        {/* Property Custodian Column */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-600">
                                Property Custodian:
                            </label>
                            <input
                                type="text"
                                value={schoolContact?.propertyCustodian || ""}
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        propertyCustodian: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                            <label className="text-sm font-medium text-gray-600 mt-4">
                                Custodian Number:
                            </label>
                            <input
                                type="text"
                                value={
                                    schoolContact?.propertyCustodianNumber || ""
                                }
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        propertyCustodianNumber: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                            <label className="text-sm font-medium text-gray-600 mt-4">
                                Custodian Email:
                            </label>
                            <input
                                type="email"
                                value={
                                    schoolContact?.propertyCustodianEmail || ""
                                }
                                onChange={(e) =>
                                    setSchoolContact({
                                        ...schoolContact!,
                                        propertyCustodianEmail: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto mt-2">
                        <h3 className="font-semibold text-gray-700 text-lg mb-2">
                            Coordinators
                        </h3>
                        <table className="w-full border border-collapse rounded-lg overflow-hidden text-gray-600">
                            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                                <tr>
                                    {[
                                        "Name",
                                        "Designation",
                                        "Email",
                                        "Number",
                                        "Remarks",
                                        "Actions",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-2 border-b border-gray-300"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {schoolContact?.coordinators.map(
                                    (coordinator, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-100 bg-white border-b"
                                        >
                                            {(
                                                [
                                                    "name",
                                                    "designation",
                                                    "email",
                                                    "number",
                                                    "remarks",
                                                ] as const
                                            ).map((field) => (
                                                <td
                                                    key={field}
                                                    className="px-4 py-2 text-sm border"
                                                >
                                                    <input
                                                        type={
                                                            field === "email"
                                                                ? "email"
                                                                : "text"
                                                        }
                                                        value={
                                                            coordinator[field]
                                                        }
                                                        onChange={(e) =>
                                                            handleCoordinatorChange(
                                                                index,
                                                                field,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-4 py-2 text-sm text-center border">
                                                <button
                                                    onClick={() =>
                                                        handleRemoveCoordinator(
                                                            index
                                                        )
                                                    }
                                                    className="text-white bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                                {/* Add new coordinator row */}
                                <tr className="bg-gray-50 border-b">
                                    {(
                                        [
                                            "name",
                                            "designation",
                                            "email",
                                            "number",
                                            "remarks",
                                        ] as const
                                    ).map((field) => (
                                        <td
                                            key={field}
                                            className="px-4 py-2 border"
                                        >
                                            <input
                                                type={
                                                    field === "email"
                                                        ? "email"
                                                        : "text"
                                                }
                                                value={newCoordinator[field]}
                                                onChange={(e) =>
                                                    setNewCoordinator(
                                                        (prev) => ({
                                                            ...prev,
                                                            [field]:
                                                                e.target.value,
                                                        })
                                                    )
                                                }
                                                className="w-full border rounded px-2 py-1"
                                                placeholder={`Enter ${field}`}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-2 text-center border">
                                        <button
                                            onClick={handleAddCoordinator}
                                            className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md"
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
        },
        {
            label: "Energized",
            value: "Energized",
            icon: BoltIcon,
            content: (
                <div className="p-6 grid grid-cols-2 gap-4">
                    {/* Energized */}
                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={schoolEnergy?.energized || false}
                            onChange={(e) =>
                                setSchoolEnergy({
                                    ...schoolEnergy!,
                                    energized: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Energized
                        </label>
                    </div>

                    {/* Local Grid Supply */}
                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={schoolEnergy?.localGridSupply || false}
                            onChange={(e) =>
                                setSchoolEnergy({
                                    ...schoolEnergy!,
                                    localGridSupply: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Local Grid Supply
                        </label>
                    </div>

                    {/* REMARKS and TYPE on the same line */}
                    <div className="flex items-center gap-4 col-span-2 mt-4">
                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-600">
                                REMARKS
                            </label>
                            <input
                                type="text"
                                value={schoolEnergy?.remarks || ""}
                                onChange={(e) =>
                                    setSchoolEnergy({
                                        ...schoolEnergy!,
                                        remarks: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-sm font-medium text-gray-600">
                                TYPE
                            </label>
                            <input
                                type="text"
                                value={schoolEnergy?.type || ""}
                                onChange={(e) =>
                                    setSchoolEnergy({
                                        ...schoolEnergy!,
                                        type: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                </div>
            ),
        },
        {
            label: "NTC",
            value: "NTC",
            icon: SignalIcon,
            content: (
                <div className="p-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Broadband
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2 col-span-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.internet || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    internet: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Internet
                        </label>
                    </div>

                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Cellular Network
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.pldt || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    pldt: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            PLDT
                        </label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.globe || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    globe: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Globe
                        </label>
                    </div>

                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Broadcast Coverage
                        </h3>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.am || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    am: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            AM Radio
                        </label>
                    </div>

                    {/* FM Radio */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.fm || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    fm: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            FM Radio
                        </label>
                    </div>

                    {/* TV Access */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.tv || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    tv: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            TV Access
                        </label>
                    </div>

                    {/* Cable Access */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={schoolNTC?.cable || false}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    cable: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Cable Access
                        </label>
                    </div>

                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Providers
                        </h3>
                    </div>

                    {/* Check if data is loading */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="flex-1 overflow-y-auto col-span-2">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Internet Provider
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Speed
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Unit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Iterate over the list of providers */}
                                    {schoolNTC?.providers?.map(
                                        (provider, index) => (
                                            <tr
                                                key={index}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                {/* Internet Provider */}
                                                <td className="px-6 text-sm font-medium border border-slate-300">
                                                    <select
                                                        value={
                                                            provider.name || ""
                                                        }
                                                        onChange={(e) => {
                                                            const updatedProviders =
                                                                [
                                                                    ...schoolNTC.providers!,
                                                                ];
                                                            updatedProviders[
                                                                index
                                                            ] = {
                                                                ...updatedProviders[
                                                                    index
                                                                ],
                                                                name: e.target
                                                                    .value,
                                                            };
                                                            setSchoolNTC({
                                                                ...schoolNTC!,
                                                                providers:
                                                                    updatedProviders,
                                                            });
                                                        }}
                                                        className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                                    >
                                                        <option value="">
                                                            Select a provider
                                                        </option>
                                                        {internetProviders.map(
                                                            (provider) => (
                                                                <option
                                                                    key={
                                                                        provider
                                                                    }
                                                                    value={
                                                                        provider
                                                                    }
                                                                >
                                                                    {provider}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>

                                                {/* Speed */}
                                                <td className="px-6 text-sm font-medium border border-slate-300">
                                                    <input
                                                        type="number"
                                                        value={
                                                            provider.speed || ""
                                                        }
                                                        onChange={(e) => {
                                                            const updatedProviders =
                                                                [
                                                                    ...schoolNTC.providers!,
                                                                ];
                                                            updatedProviders[
                                                                index
                                                            ] = {
                                                                ...updatedProviders[
                                                                    index
                                                                ],
                                                                speed: parseInt(
                                                                    e.target
                                                                        .value,
                                                                    10
                                                                ),
                                                            };
                                                            setSchoolNTC({
                                                                ...schoolNTC!,
                                                                providers:
                                                                    updatedProviders,
                                                            });
                                                        }}
                                                        className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                                    />
                                                </td>

                                                {/* Unit */}
                                                <td className="px-6 text-sm font-medium border border-slate-300">
                                                    <select
                                                        value={
                                                            provider.unit || ""
                                                        }
                                                        onChange={(e) => {
                                                            const updatedProviders =
                                                                [
                                                                    ...schoolNTC.providers!,
                                                                ];
                                                            updatedProviders[
                                                                index
                                                            ] = {
                                                                ...updatedProviders[
                                                                    index
                                                                ],
                                                                unit: e.target
                                                                    .value,
                                                            };
                                                            setSchoolNTC({
                                                                ...schoolNTC!,
                                                                providers:
                                                                    updatedProviders,
                                                            });
                                                        }}
                                                        className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                                    >
                                                        <option value="">
                                                            Select a unit
                                                        </option>
                                                        {unitOptions.map(
                                                            (unit) => (
                                                                <option
                                                                    key={unit}
                                                                    value={unit}
                                                                >
                                                                    {unit}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </td>
                                                {/* Remove Button */}
                                                <td className="px-6 text-center border border-slate-300">
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveProvider(
                                                                index
                                                            )
                                                        }
                                                        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}

                                    {/* Row for adding new provider */}
                                    <tr className="h-12 px-6 text-sm font-medium border border-slate-300">
                                        <td className="px-6 text-sm font-medium border border-slate-300">
                                            <select
                                                value={newProviderName}
                                                onChange={(e) =>
                                                    setNewProviderName(
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                            >
                                                <option value="">
                                                    Select a provider
                                                </option>
                                                {internetProviders.map(
                                                    (provider) => (
                                                        <option
                                                            key={provider}
                                                            value={provider}
                                                        >
                                                            {provider}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>

                                        <td className="px-6 text-sm font-medium border border-slate-300">
                                            <input
                                                type="number"
                                                value={newProviderSpeed}
                                                onChange={(e) =>
                                                    setNewProviderSpeed(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                                className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                                min="0"
                                            />
                                        </td>

                                        <td className="px-6 text-sm font-medium border border-slate-300">
                                            <select
                                                value={newProviderUnit}
                                                onChange={(e) =>
                                                    setNewProviderUnit(
                                                        e.target.value
                                                    )
                                                }
                                                className="h-10 w-full rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                            >
                                                <option value="">
                                                    Select a unit
                                                </option>
                                                {unitOptions.map((unit) => (
                                                    <option
                                                        key={unit}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td
                                            colSpan={3}
                                            className="px-6 text-sm font-medium border border-slate-300 text-center"
                                        >
                                            <button
                                                onClick={handleAddProvider}
                                                className="text-white bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md"
                                            >
                                                Add
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="col-span-2 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            NTC Remarks
                        </h3>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            Remarks:
                        </label>
                        <input
                            type="text"
                            value={schoolNTC?.remark || ""}
                            onChange={(e) =>
                                setSchoolNTC({
                                    ...schoolNTC!,
                                    remark: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>
                </div>
            ),
        },
    ];

    const data = [
        {
            label: "Profile",
            value: "Profile",
            icon: UserCircleIcon,
            content: (
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-6"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        {/* User Profile Section */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            User Profile
                        </h2>
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            {[
                                {
                                    label: "Username",
                                    name: "username" as const,
                                }, // Explicitly define name
                                { label: "Email", name: "email" as const },
                            ].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={formData[field.name]} // Now TypeScript recognizes field.name as a valid key
                                        onChange={handleUserChange}
                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                    />
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="filled"
                            color="blue"
                            className="h-12 w-auto text-white font-bold shadow-md rounded-lg transition-transform transform hover:scale-105"
                            onClick={handleUpdateUser}
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            Update
                        </Button>

                        {division && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    Division
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "Division",
                                            name: "division",
                                            value: division.division,
                                        },
                                        {
                                            label: "Title",
                                            name: "title",
                                            value: division.title,
                                        },
                                        {
                                            label: "SDS Name",
                                            name: "sdsName",
                                            value: division.sdsName,
                                        },
                                        {
                                            label: "SDS Position",
                                            name: "sdsPosition",
                                            value: division.sdsPosition,
                                        },
                                        {
                                            label: "ITO Name",
                                            name: "itoName",
                                            value: division.itoName,
                                        },
                                        {
                                            label: "ITO Email",
                                            name: "itoEmail",
                                            value: division.itoEmail,
                                        },
                                    ].map((field, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <label className="text-sm font-medium text-gray-600 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                type="text"
                                                name={field.name} // ✅ Ensure correct binding
                                                value={field.value ?? ""} // ✅ Prevent uncontrolled component error
                                                onChange={handleDivisionChange}
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="filled"
                                    color="blue"
                                    className="h-12 w-auto text-white font-bold shadow-md rounded-lg transition-transform transform hover:scale-105 mt-10"
                                    onClick={handleUpdateDivision}
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                >
                                    Update
                                </Button>
                            </>
                        )}

                        {/* School Section */}
                        {school && (
                            <div className="mt-10">
                                <Tabs value={activeSchoolTab}>
                                    <TabsHeader
                                        className="bg-gray-100 shadow-md p-1 rounded-xl flex justify-center"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        {TabData.map(
                                            ({ label, value, icon }) => (
                                                <Tab
                                                    key={value}
                                                    value={value}
                                                    onClick={() =>
                                                        setActiveSchoolTab(
                                                            value
                                                        )
                                                    }
                                                    className={`flex items-center gap-2 justify-center p-2`}
                                                    placeholder=""
                                                    onPointerEnterCapture={() => {}}
                                                    onPointerLeaveCapture={() => {}}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {React.createElement(
                                                            icon,
                                                            {
                                                                className:
                                                                    "w-5 h-5",
                                                            }
                                                        )}
                                                        <span className="hidden sm:block">
                                                            {label}
                                                        </span>
                                                    </div>
                                                </Tab>
                                            )
                                        )}
                                    </TabsHeader>
                                    <TabsBody
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        {TabData.map(({ value, content }) => (
                                            <TabPanel key={value} value={value}>
                                                {content}
                                            </TabPanel>
                                        ))}
                                    </TabsBody>
                                </Tabs>
                                <Button
                                    variant="filled"
                                    color="blue"
                                    className="h-12 w-auto text-white font-bold shadow-md rounded-lg transition-transform transform hover:scale-105"
                                    onClick={handleUpdateSchool}
                                    placeholder=""
                                    onPointerEnterCapture={() => {}}
                                    onPointerLeaveCapture={() => {}}
                                >
                                    Update
                                </Button>
                            </div>
                        )}
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Municipality",
            value: "Municipality",
            icon: Square3Stack3DIcon,
            content: (
                <Card
                    className="w-full bg-white rounded-xl shadow-md overflow-hidden"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-6"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            Municipalities List
                        </h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="w-full max-h-96 overflow-y-auto">
                                <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                    <thead>
                                        <tr className="bg-slate-100 text-gray-700">
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                Number
                                            </th>
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                Municipality
                                            </th>
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                District
                                            </th>
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                Division
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {municipalities.map(
                                            (
                                                municipality,
                                                municipalityIndex
                                            ) => {
                                                // Get all districts related to this municipality
                                                const relatedDistricts =
                                                    districts.filter(
                                                        (district) =>
                                                            district.name.includes(
                                                                municipality.name
                                                            )
                                                    );

                                                return relatedDistricts.map(
                                                    (
                                                        district,
                                                        districtIndex
                                                    ) => {
                                                        return (
                                                            <tr
                                                                key={`${municipality.municipalityId}-${district.districtId}`}
                                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                                            >
                                                                {/* Row Number (Only on first row of each municipality) */}
                                                                {districtIndex ===
                                                                0 ? (
                                                                    <td
                                                                        rowSpan={
                                                                            relatedDistricts.length
                                                                        }
                                                                        className="h-12 px-6 text-sm font-medium border border-slate-300 text-center"
                                                                    >
                                                                        {municipalityIndex +
                                                                            1}
                                                                    </td>
                                                                ) : null}

                                                                {/* Municipality Name (Only on first row of each municipality) */}
                                                                {districtIndex ===
                                                                0 ? (
                                                                    <td
                                                                        rowSpan={
                                                                            relatedDistricts.length
                                                                        }
                                                                        className="h-12 px-6 text-sm font-medium border border-slate-300"
                                                                    >
                                                                        {
                                                                            municipality.name
                                                                        }
                                                                    </td>
                                                                ) : null}

                                                                {/* District Name */}
                                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                                    {
                                                                        district.name
                                                                    }
                                                                </td>

                                                                {/* Division Name */}
                                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                                    {district
                                                                        .division
                                                                        .division ||
                                                                        "N/A"}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Password",
            value: "Password",
            icon: Cog6ToothIcon,
            content: (
                <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Change Password
                    </h3>
                    <form className="space-y-4" onSubmit={handleChangePassword}>
                        {[
                            {
                                label: "Current Password",
                                field: "oldPassword",
                                placeholder: "Enter current password",
                            },
                            {
                                label: "New Password",
                                field: "newPassword",
                                placeholder: "Enter new password",
                            },
                            {
                                label: "Confirm New Password",
                                field: "confirmNewPassword",
                                placeholder: "Confirm new password",
                            },
                        ].map(({ label, field, placeholder }) => (
                            <div key={field} className="flex flex-col">
                                <label
                                    htmlFor={field}
                                    className="text-sm font-medium text-gray-600 mb-1"
                                >
                                    {label}
                                </label>
                                <input
                                    id={field}
                                    type="password"
                                    placeholder={placeholder}
                                    className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    onChange={(e) =>
                                        handleInputChange(
                                            field as
                                                | "oldPassword"
                                                | "newPassword"
                                                | "confirmNewPassword",
                                            e.target.value
                                        )
                                    }
                                    aria-label={label}
                                />
                            </div>
                        ))}

                        {/* Change Password Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full mx-auto p-4">
            <Tabs value={activeTab} onChange={(val: any) => setActiveTab(val)}>
                <TabsHeader
                    className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-4xl mx-auto rounded-xl flex justify-center "
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {data.map(({ label, value, icon }) => (
                        <Tab
                            key={value}
                            value={value}
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <div className="flex items-center gap-2 text-gray-800 w-full">
                                {/* ✅ Always Show Icon */}
                                {React.createElement(icon, {
                                    className: "w-5 h-5",
                                })}
                                {/* ✅ Hide Text on Mobile (sm:hidden), Show on Larger Screens */}
                                <span className="hidden sm:block">{label}</span>
                            </div>
                        </Tab>
                    ))}
                </TabsHeader>

                <TabsBody
                    className="p-4"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {data.map(({ value, content }) => (
                        <TabPanel key={value} value={value}>
                            {content}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    severity={snackbarSeverity}
                    onClose={() => setOpenSnackbar(false)}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Settings;
