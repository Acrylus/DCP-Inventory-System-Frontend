import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import {
    Button,
    Card,
    CardBody,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { createSchool } from "../../lib/school-api/createSchool";
import { updateSchoolById } from "../../lib/school-api/updateSchool";
import { deleteSchoolById } from "../../lib/school-api/deleteSchool";
import {
    Square3Stack3DIcon,
    UserIcon,
    BoltIcon,
    SignalIcon,
} from "@heroicons/react/24/solid";
import { useUserInfo } from "../../store/UserInfoStore";
import { getAllDistricts } from "../../lib/district-api/getAllDistrict";
import { getDivisionById } from "../../lib/division-api/getDivision";
import { getSchoolContact } from "../../lib/schoolcontact-api/getSchoolContactBySchoolId";
import { getSchoolEnergy } from "../../lib/schoolenergy-api/getSchoolEnergyBySchoolId";
import { getSchoolNTC } from "../../lib/schoolntc-api/getSchoolNTCBySchoolId";
import { updateSchoolContact } from "../../lib/schoolcontact-api/updateSchoolContact";
import { updateSchoolEnergy } from "../../lib/schoolenergy-api/updateSchoolEnergy";
import { updateSchoolNTC } from "../../lib/schoolntc-api/updateSchoolNTC";
import { Snackbar } from "@mui/material";

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
    division: Division;
    name: string;
}

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    email: string;
    name: string;
    address: string;
    previousStation: string;
}

interface Coordinator {
    coordinatorId: number;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
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

const classificationOptions = [
    "Primary (K-3)",
    "Elementary",
    "Secondary (JHS/SHS)",
    "JHS",
    "SHS",
    "Integrated School",
];

const unitOptions = ["kbps", "mbps", "gbps"];

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

const SchoolProfile = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");
    const [division, setDivision] = useState<Division | null>(null);
    const [schoolContact, setSchoolContact] = useState<SchoolContact | null>(
        null
    );
    const [schoolEnergy, setSchoolEnergy] = useState<SchoolEnergy | null>(null);
    const [schoolNTC, setSchoolNTC] = useState<SchoolNTC | null>(null);

    const [newProviderName, setNewProviderName] = useState("");
    const [newProviderSpeed, setNewProviderSpeed] = useState(0);
    const [newProviderUnit, setNewProviderUnit] = useState("");

    const { userInfo } = useUserInfo();

    const [districts, setDistricts] = useState<District[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSchoolData, setNewSchoolData] = useState<any>({
        district: {
            districtId: 0,
            name: "",
            division: division ?? {
                divisionId: 0,
                division: "",
                title: "",
                sdsName: "",
                sdsPosition: "",
                itoName: "",
                itoEmail: "",
            },
        },
        classification: "",
        schoolId: "",
        division: division ?? {
            divisionId: 0,
            division: "",
            title: "",
            sdsName: "",
            sdsPosition: "",
            itoName: "",
            itoEmail: "",
        },
        address: "",
        name: "",
        previousStation: "",
        coordinators: [],
    });

    const [newCoordinator, setNewCoordinator] = useState<Coordinator>({
        coordinatorId: 0,
        name: "",
        designation: "",
        email: "",
        number: "",
        remarks: "",
    });

    const [activeTab, setActiveTab] = useState<string>("Profile");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    useEffect(() => {
        console.log("Navbar Updated User Info:", userInfo);

        const fetchDivision = async () => {
            if (userInfo.referenceId) {
                const divisionData = await getDivisionById(
                    userInfo.referenceId
                );
                setDivision(divisionData);
                setNewSchoolData((prevState: any) => ({
                    ...prevState,
                    division: divisionData,
                }));
            }
        };

        fetchDivision();
    }, [userInfo]);

    useEffect(() => {
        console.log("Current Active Tab:", activeTab);
    }, [activeTab]);

    const handleUpdateSchool = async () => {
        try {
            console.log("Active Tab:", activeTab);

            if (activeTab === "Profile" && selectedSchool) {
                console.log("Updating School:", selectedSchool);
                await updateSchoolById(selectedSchool);
                console.log("School updated successfully");
                setSnackbarMessage("School updated successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }

            if (activeTab === "Contact" && schoolContact) {
                console.log("Updating School:", schoolContact);
                await updateSchoolContact(
                    schoolContact.schoolContactId,
                    schoolContact
                );
                console.log("School contact updated successfully");
                setSnackbarMessage("School contact updated successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }

            if (activeTab === "Energized" && schoolEnergy) {
                await updateSchoolEnergy(
                    schoolEnergy.schoolEnergyId,
                    schoolEnergy
                );
                console.log("School energy updated successfully");
                setSnackbarMessage("School energy updated successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }

            if (activeTab === "NTC" && schoolNTC) {
                await updateSchoolNTC(schoolNTC.schoolNTCId, schoolNTC);
                console.log("School NTC updated successfully");
                setSnackbarMessage("School NTC updated successfully");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Error updating school:", error);
            setSnackbarMessage("Failed to update school");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleRemoveCoordinator = (index: number) => {
        setSchoolContact((prev) => {
            const updatedCoordinators = prev!.coordinators.filter(
                (_, i) => i !== index
            );
            if (updatedCoordinators.length !== prev!.coordinators.length) {
                setSnackbarMessage("Coordinator removed successfully.");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }
            return { ...prev!, coordinators: updatedCoordinators };
        });
    };

    const handleAddCoordinator = () => {
        if (
            !newCoordinator.name ||
            !newCoordinator.designation ||
            !newCoordinator.email ||
            !newCoordinator.number
        ) {
            setSnackbarMessage("Invalid coordinator data.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
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

        setSchoolContact((prev) => {
            const updatedCoordinators = [
                ...(prev?.coordinators || []),
                newCoordinatorData,
            ];
            setSnackbarMessage("Coordinator added successfully.");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
            return { ...prev!, coordinators: updatedCoordinators };
        });

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
        setSchoolNTC((prev) => {
            const updatedProviders = prev!.providers.filter(
                (_, i) => i !== index
            );
            if (updatedProviders.length !== prev!.providers.length) {
                setSnackbarMessage("Provider removed successfully.");
                setSnackbarSeverity("success");
                setOpenSnackbar(true);
            }
            return { ...prev!, providers: updatedProviders };
        });
    };

    const handleAddProvider = () => {
        if (!newProviderName || !newProviderUnit || isNaN(newProviderSpeed)) {
            setSnackbarMessage("Invalid provider data.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        const newProvider = {
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

        // Show success message
        setSnackbarMessage("Provider added successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const data = [
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
                            value={selectedSchool?.schoolRecordId || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            value={selectedSchool?.schoolId || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            value={
                                selectedSchool?.district.division.division || ""
                            }
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
                            value={selectedSchool?.district?.name || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    district: {
                                        ...selectedSchool!.district,
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
                            value={selectedSchool?.name || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            value={selectedSchool?.classification || ""}
                            onChange={(e) => {
                                setSelectedSchool((prevState) => {
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
                            value={selectedSchool?.address || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const data = await getAllSchools();
            setSchools(data);
        } catch (error) {
            console.error("Error fetching schools:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        setLoading(true);
        try {
            const data = await getAllDistricts();
            setDistricts(data);
        } catch (error) {
            console.error("Error fetching schools:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Selected School before fetch: ", selectedSchool);

        if (selectedSchool && selectedSchool.schoolRecordId) {
            const fetchSchoolData = async () => {
                try {
                    const [contactData, energyData, ntcData] =
                        await Promise.all([
                            getSchoolContact(selectedSchool.schoolRecordId),
                            getSchoolEnergy(selectedSchool.schoolRecordId),
                            getSchoolNTC(selectedSchool.schoolRecordId),
                        ]);

                    console.log("Fetched Contact Data: ", contactData);
                    console.log("Fetched Energy Data: ", energyData);
                    console.log("Fetched NTC Data: ", ntcData);

                    setSchoolContact(contactData);
                    setSchoolEnergy(energyData);
                    setSchoolNTC(ntcData);
                } catch (error) {
                    console.error("Error fetching school data:", error);
                }
            };

            fetchSchoolData();
        } else {
            console.warn("No valid selectedSchool found, skipping fetch");
            setSchoolContact(null);
            setSchoolEnergy(null);
            setSchoolNTC(null);
        }
    }, [selectedSchool]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleRowClick = (school: School) => {
        setSelectedSchool(school);

        setSnackbarMessage(`School ${school.name} selected successfully.`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const filteredSchools = schools.filter((school) => {
        const matchesSearchQuery = school.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesDivision = selectedDivision
            ? school.district.division.division === selectedDivision
            : true;

        const matchesMunicipality = selectedDistrict
            ? school.district.name === selectedDistrict
            : true;

        const matchesClassification = selectedClassification
            ? school.classification === selectedClassification
            : true;

        return (
            matchesSearchQuery &&
            matchesDivision &&
            matchesMunicipality &&
            matchesClassification
        );
    });

    const handleDivisionChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDivision(event.target.value);
        setSnackbarMessage(`Division changed to: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleDistrictChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDistrict(event.target.value);
        setSnackbarMessage(`District changed to: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleClassificationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedClassification(event.target.value);
        setSnackbarMessage(`Classification changed to: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleAddSchool = () => {
        setIsModalOpen(true);
        setSnackbarMessage("Opening Add School Modal.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleDeleteSchool = () => {
        if (selectedSchool?.schoolRecordId) {
            console.log("Delete School", selectedSchool.schoolRecordId);
            deleteSchoolById(selectedSchool.schoolRecordId)
                .then(() => {
                    fetchSchools();
                    setSelectedSchool(null);
                    console.log("School deleted successfully");
                    setSnackbarMessage("School deleted successfully");
                    setSnackbarSeverity("success");
                    setOpenSnackbar(true);
                })
                .catch((error) => {
                    console.error("Error deleting school:", error);
                    setSnackbarMessage("Failed to delete school");
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                });
        } else {
            console.warn("No school selected for deletion");
            setSnackbarMessage("No school selected for deletion");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    return (
        <div className="p-8 h-full w-full flex flex-col gap-4">
            <div className="flex w-full justify-center">
                <Card
                    shadow={true}
                    className="w-full bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="flex flex-row flex-wrap gap-4 items-center justify-center p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <input
                            type="search"
                            placeholder="Search for schools..."
                            className="h-12 w-64 rounded-lg border border-gray-300 px-4 pr-12 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />

                        <select
                            className="h-12 w-48 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            value={selectedDivision}
                            onChange={handleDivisionChange}
                        >
                            <option value="">All Divisions</option>
                            {[
                                ...new Set(
                                    schools.map(
                                        (s) => s.district.division.division
                                    )
                                ),
                            ].map((division) => (
                                <option key={division} value={division}>
                                    {division}
                                </option>
                            ))}
                        </select>

                        <select
                            className="h-12 w-48 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            value={selectedDistrict}
                            onChange={handleDistrictChange}
                        >
                            <option value="">All Districts</option>
                            {[
                                ...new Set(schools.map((s) => s.district.name)),
                            ].map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>

                        <select
                            className="h-12 w-48 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            value={selectedClassification}
                            onChange={handleClassificationChange}
                        >
                            <option value="">All Classifications</option>
                            {classificationOptions.map((classification) => (
                                <option
                                    key={classification}
                                    value={classification}
                                >
                                    {classification}
                                </option>
                            ))}
                        </select>

                        {[
                            {
                                text: "ADD",
                                color: "blue",
                                onClick: handleAddSchool,
                            },
                            {
                                text: "DELETE",
                                color: "red",
                                onClick: handleDeleteSchool,
                            },
                            {
                                text: "UPDATE",
                                color: "amber",
                                onClick: handleUpdateSchool,
                            },
                        ].map((btn) => (
                            <Button
                                key={btn.text}
                                variant="filled"
                                color={btn.color as any}
                                className="h-12 w-auto text-white font-bold shadow-md rounded-lg transition-transform transform hover:scale-105"
                                onClick={btn.onClick}
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            >
                                {btn.text}
                            </Button>
                        ))}
                    </CardBody>
                </Card>
            </div>

            <div className="flex w-full gap-4 h-[60vh]">
                <Card
                    shadow={true}
                    className="w-[70%] bg-white rounded-xl "
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4 overflow-auto"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            School Details
                        </h2>

                        <Tabs value={activeTab}>
                            <TabsHeader
                                className="bg-gray-100 shadow-md p-1 rounded-xl flex justify-center"
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            >
                                {data.map(({ label, value, icon }) => (
                                    <Tab
                                        key={value}
                                        value={value}
                                        onClick={() => setActiveTab(value)}
                                        className={`flex items-center gap-2 justify-center p-2`}
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        <div className="flex items-center gap-2">
                                            {React.createElement(icon, {
                                                className: "w-5 h-5",
                                            })}
                                            <span className="hidden sm:block">
                                                {label}
                                            </span>
                                        </div>
                                    </Tab>
                                ))}
                            </TabsHeader>
                            <TabsBody
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            >
                                {selectedSchool ? (
                                    data.map(({ value, content }) => (
                                        <TabPanel key={value} value={value}>
                                            {content}
                                        </TabPanel>
                                    ))
                                ) : (
                                    <div className="text-center text-gray-500 p-4">
                                        Please select a school to view details.
                                    </div>
                                )}
                            </TabsBody>
                        </Tabs>
                    </CardBody>
                </Card>

                <Card
                    shadow={true}
                    className="w-[30%] bg-white rounded-xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4 flex flex-col h-full"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            School List
                        </h2>
                        {loading ? (
                            <p className="animate-pulse">Loading...</p>
                        ) : (
                            <div className="flex-1 overflow-y-auto mt-4">
                                <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                    <thead>
                                        <tr className="bg-slate-100 text-gray-700">
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                School ID
                                            </th>
                                            <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                School Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSchools.map((school) => (
                                            <tr
                                                key={school.schoolRecordId}
                                                onClick={() =>
                                                    handleRowClick(school)
                                                }
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100 cursor-pointer"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {school.schoolId}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {school.name}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Add New School
                        </h2>
                        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Division (2-column width, read-only) */}
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Division:
                                </label>
                                <input
                                    type="text"
                                    value={
                                        newSchoolData.division?.division || ""
                                    }
                                    readOnly
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 bg-gray-100"
                                />
                            </div>

                            {/* School ID (Side by side with District) */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    School ID:
                                </label>
                                <input
                                    type="text"
                                    value={newSchoolData?.schoolId || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            schoolId: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* District (Side by side with School ID) */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    District:
                                </label>
                                <select
                                    value={newSchoolData?.district?.name || ""}
                                    onChange={(e) => {
                                        const selectedDistrict = districts.find(
                                            (district) =>
                                                district.name === e.target.value
                                        );
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            district: selectedDistrict
                                                ? {
                                                      name: selectedDistrict.name,
                                                      districtId:
                                                          selectedDistrict.districtId,
                                                      division:
                                                          selectedDistrict.division,
                                                  }
                                                : undefined,
                                        });
                                    }}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
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

                            {/* School Name (Side by side with Classification) */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    School Name:
                                </label>
                                <input
                                    type="text"
                                    value={newSchoolData?.name || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Classification (Side by side with School Name) */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Classification:
                                </label>
                                <select
                                    value={newSchoolData?.classification || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            classification: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                >
                                    <option value="" disabled>
                                        Select Classification
                                    </option>
                                    {classificationOptions.map(
                                        (option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Address (2-column width) */}
                            <div className="flex flex-col col-span-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Address:
                                </label>
                                <textarea
                                    value={newSchoolData?.address || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            address: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-100 px-4 py-2 rounded-md hover:bg-gray-100 bg-red-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    console.error("CHECK", newSchoolData);
                                    createSchool(newSchoolData as School)
                                        .then(() => {
                                            fetchSchools();
                                            setIsModalOpen(false);
                                        })
                                        .catch((error) =>
                                            console.error(
                                                "Error adding school:",
                                                error
                                            )
                                        );
                                }}
                                className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default SchoolProfile;
