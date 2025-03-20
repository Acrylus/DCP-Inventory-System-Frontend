import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import {
    Cog6ToothIcon,
    UserCircleIcon,
    Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import { getMunicipalities } from "../../lib/municipality-api/getAllMunicipality";
import { useUserInfo } from "../../store/UserInfoStore";
import { Card, CardBody } from "@material-tailwind/react";
import { changePassword } from "../../lib/user-api/changePassword";
import { useAuth } from "../../store/AuthStore";
import { getDivisionById } from "../../lib/division-api/getDivision";
import { getSchoolById } from "../../lib/school-api/getSchool";
import { getSchoolContact } from "../../lib/schoolcontact-api/getSchooContactBySchoolId";
import { getSchoolEnergy } from "../../lib/schoolenergy-api/getSchoolEnergyBySchoolId";
import { getSchoolNTC } from "../../lib/schoolntc-api/getSchoolNTCBySchoolId";
import { getAllDistricts } from "../../lib/district-api/getAllDistrict";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
    division: Division;
    district: District;
    classification: string | null;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string | null;
}

interface SchoolContact {
    schoolContactId: number;
    schoolRecordId: number;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}

interface SchoolEnergy {
    schoolEnergyId: number;
    schoolRecordId: number;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
}

interface SchoolNTC {
    schoolNtcId: number;
    schoolRecordId: number;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
}

export interface ChangePasswordPayload {
    userId: number;
    oldPassword: string;
    newPassword: string;
}

const Settings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
    const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useUserInfo();
    const { auth } = useAuth();

    const [division, setDivision] = useState<Division | null>(null);
    const [school, setSchool] = useState<School | null>(null);
    const [schoolContacts, setSchoolContacts] = useState<SchoolContact | null>(
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
                        const schoolContactsData = await getSchoolContact(
                            schoolData.schoolRecordId
                        );
                        setSchoolContacts(schoolContactsData);

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
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                {
                                    label: "Username",
                                    value: userInfo?.username || "",
                                },
                                {
                                    label: "Email",
                                    value: userInfo?.email || "",
                                },
                            ].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type="text"
                                        value={field.value}
                                        readOnly
                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Division Section */}
                        {division && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    Division
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "Division",
                                            value: division.division,
                                        },
                                        {
                                            label: "Title",
                                            value: division.title,
                                        },
                                        {
                                            label: "SDS Name",
                                            value: division.sdsName,
                                        },
                                        {
                                            label: "ITO Name",
                                            value: division.itoName,
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
                                                value={field.value}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* School Section */}
                        {school && (
                            <>
                                <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                    School
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        {
                                            label: "School Name",
                                            value: school.name,
                                        },
                                        {
                                            label: "Address",
                                            value: school.address ?? "",
                                        },
                                        {
                                            label: "School Head",
                                            value:
                                                schoolContacts?.schoolHead ??
                                                "",
                                        },
                                        {
                                            label: "School Head Number",
                                            value:
                                                schoolContacts?.schoolHeadNumber ??
                                                "",
                                        },
                                        {
                                            label: "School Head Email",
                                            value:
                                                schoolContacts?.schoolHeadEmail ??
                                                "",
                                        },
                                        {
                                            label: "School ID",
                                            value: school.schoolId,
                                        },
                                        {
                                            label: "Division",
                                            value: school.division.division,
                                        },
                                        {
                                            label: "District",
                                            value: school.district.name,
                                        },
                                        {
                                            label: "Classification",
                                            value: school.classification ?? "",
                                        },
                                        {
                                            label: "Previous Station",
                                            value: school.previousStation ?? "",
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
                                                value={field.value}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* School Contacts Section */}
                                {schoolContacts && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School Contacts
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "Landline",
                                                    value: schoolContacts.landline,
                                                },
                                                {
                                                    label: "Designation",
                                                    value: schoolContacts.designation,
                                                },
                                                {
                                                    label: "Property Custodian",
                                                    value: schoolContacts.propertyCustodian,
                                                },
                                                {
                                                    label: "Property Custodian Number",
                                                    value: schoolContacts.propertyCustodianNumber,
                                                },
                                                {
                                                    label: "Property Custodian Email",
                                                    value: schoolContacts.propertyCustodianEmail,
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
                                                        value={
                                                            field.value ?? ""
                                                        }
                                                        readOnly
                                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* School Energy Section */}
                                {schoolEnergy && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School Energy
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "Energized",
                                                    value: schoolEnergy.energized
                                                        ? "Yes"
                                                        : "No",
                                                },
                                                {
                                                    label: "Local Grid Supply",
                                                    value: schoolEnergy.localGridSupply
                                                        ? "Yes"
                                                        : "No",
                                                },
                                                {
                                                    label: "Remarks",
                                                    value:
                                                        schoolEnergy.remarks ??
                                                        "",
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
                                                        value={field.value}
                                                        readOnly
                                                        className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* School NTC Section */}
                                {schoolNTC && (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">
                                            School NTC
                                        </h2>
                                        <div className="grid grid-cols-2 gap-6">
                                            {[
                                                {
                                                    label: "PLDT",
                                                    value: schoolNTC.pldt,
                                                },
                                                {
                                                    label: "Globe",
                                                    value: schoolNTC.globe,
                                                },
                                                {
                                                    label: "TV Access",
                                                    value: schoolNTC.tv,
                                                },
                                                {
                                                    label: "Internet",
                                                    value: schoolNTC.internet,
                                                },
                                                {
                                                    label: "AM",
                                                    value: schoolNTC.am,
                                                },
                                                {
                                                    label: "FM",
                                                    value: schoolNTC.fm,
                                                },
                                                {
                                                    label: "Cable",
                                                    value: schoolNTC.cable,
                                                },
                                            ].map((checkbox, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center"
                                                >
                                                    <label className="text-sm font-medium text-gray-600 mr-2">
                                                        {checkbox.label}:
                                                    </label>
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(
                                                            checkbox.value
                                                        )}
                                                        readOnly
                                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4">
                                            <label className="text-sm font-medium text-gray-600">
                                                Remarks
                                            </label>
                                            <input
                                                type="text"
                                                value={schoolNTC.remark ?? ""}
                                                readOnly
                                                className="h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700 bg-gray-100"
                                            />
                                        </div>
                                    </>
                                )}
                            </>
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
