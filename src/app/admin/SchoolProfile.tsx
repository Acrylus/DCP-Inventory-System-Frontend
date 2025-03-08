import React, { useEffect, useState } from "react";
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

interface School {
    schoolRecordId: number;
    name: string;
    division: Division;
    district: District;
    classification?: string;
    schoolId?: string;
    address?: string;
    landline?: string;
    schoolHead?: string;
    schoolHeadNumber?: string;
    schoolHeadEmail?: string;
    propertyCustodian?: string;
    propertyCustodianNumber?: string;
    propertyCustodianEmail?: string;
    energized?: boolean;
    energizedRemarks?: string;
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
    coordinators?: Coordinator[];
    schoolBatchList?: any[];
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

interface Coordinator {
    coordinatorId: number;
    school: School;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
}

const classificationOptions = [
    "Primary (K-3)",
    "Elementary",
    "Secondary (JHS/SHS)",
    "JHS",
    "SHS",
    "Integrated School",
    "Division",
];

const SchoolProfile = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");
    const [division, setDivision] = useState<Division>();

    const { userInfo } = useUserInfo();

    const [districts, setDistricts] = useState<District[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSchoolData, setNewSchoolData] = useState<Partial<School>>({
        division: division,
    });

    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        console.log("Navbar Updated User Info:", userInfo);
        if (userInfo.division) {
            setDivision(userInfo.division);
        }
    }, [userInfo]);

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
                            value={selectedSchool?.division.division || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    division: {
                                        ...selectedSchool!.division,
                                        division: e.target.value,
                                    },
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* District */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            District:
                        </label>
                        <input
                            type="text"
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
                        />
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
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600">
                            Classification:
                        </label>
                        <input
                            type="text"
                            value={selectedSchool?.classification || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    classification: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
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
                            value={selectedSchool?.landline || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                                value={selectedSchool?.schoolHead || ""}
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
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
                                value={selectedSchool?.schoolHeadNumber || ""}
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
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
                                value={selectedSchool?.schoolHeadEmail || ""}
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
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
                                value={selectedSchool?.propertyCustodian || ""}
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
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
                                    selectedSchool?.propertyCustodianNumber ||
                                    ""
                                }
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
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
                                    selectedSchool?.propertyCustodianEmail || ""
                                }
                                onChange={(e) =>
                                    setSelectedSchool({
                                        ...selectedSchool!,
                                        propertyCustodianEmail: e.target.value,
                                    })
                                }
                                className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Coordinator Table */}
                    <div className="overflow-x-auto mt-2">
                        <h3 className="font-semibold text-gray-700 text-lg mb-2">
                            Coordinators
                        </h3>
                        <table className="w-full border border-collapse rounded-lg overflow-hidden text-gray-600">
                            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-2 border-b border-gray-300">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 border-b border-gray-300">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 border-b border-gray-300">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 border-b border-gray-300">
                                        Number
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSchool?.coordinators?.map(
                                    (coordinator, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-gray-100 ${
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                                                {coordinator.coordinatorId}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                                                {coordinator.name}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                                                {coordinator.email}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-300">
                                                {coordinator.number}
                                            </td>
                                        </tr>
                                    )
                                )}
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
                            checked={selectedSchool?.energized || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            checked={selectedSchool?.localGridSupply || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    localGridSupply: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Local Grid Supply
                        </label>
                    </div>

                    {/* Energized Remarks */}
                    <div className="flex flex-col col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            Energized Remarks:
                        </label>
                        <input
                            type="text"
                            value={selectedSchool?.energizedRemarks || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    energizedRemarks: e.target.value,
                                })
                            }
                            className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                        />
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
                    {/* Connectivity */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedSchool?.connectivity || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    connectivity: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Connectivity
                        </label>
                    </div>

                    {/* Smart */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedSchool?.smart || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    smart: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Smart
                        </label>
                    </div>

                    {/* Globe */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedSchool?.globe || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    globe: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Globe
                        </label>
                    </div>

                    {/* Digital Network */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedSchool?.digitalNetwork || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    digitalNetwork: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Digital Network
                        </label>
                    </div>

                    {/* AM Radio */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedSchool?.am || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            checked={selectedSchool?.fm || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            checked={selectedSchool?.tv || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
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
                            checked={selectedSchool?.cable || false}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    cable: e.target.checked,
                                })
                            }
                            className="w-5 h-5"
                        />
                        <label className="text-sm font-medium text-gray-600">
                            Cable Access
                        </label>
                    </div>

                    {/* NTC Remark */}
                    <div className="flex flex-col col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                            NTC Remark:
                        </label>
                        <input
                            type="text"
                            value={selectedSchool?.ntcRemark || ""}
                            onChange={(e) =>
                                setSelectedSchool({
                                    ...selectedSchool!,
                                    ntcRemark: e.target.value,
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleRowClick = (school: School) => {
        setSelectedSchool(school);
    };

    const filteredSchools = schools.filter((school) => {
        const matchesSearchQuery = school.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesDivision = selectedDivision
            ? school.division.division === selectedDivision
            : true;

        const matchesMunicipality = selectedMunicipality
            ? school.district.name === selectedMunicipality
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
    };

    const handleMunicipalityChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedMunicipality(event.target.value);
    };

    const handleClassificationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedClassification(event.target.value);
    };

    const handleAddSchool = () => {
        console.log(userInfo.division);
        setNewSchoolData({});
        setIsModalOpen(true);
    };

    const handleDeleteSchool = () => {
        if (selectedSchool?.schoolRecordId) {
            console.log("Delete School", selectedSchool.schoolRecordId);
            deleteSchoolById(selectedSchool.schoolRecordId)
                .then(() => {
                    fetchSchools();
                    setSelectedSchool(null);
                    console.log("School deleted successfully");
                })
                .catch((error) =>
                    console.error("Error deleting school:", error)
                );
        } else {
            console.warn("No school selected for deletion");
        }
    };

    const handleUpdateSchool = () => {
        if (selectedSchool) {
            console.log("Update School", selectedSchool);
            updateSchoolById(selectedSchool)
                .then(() => {
                    fetchSchools();
                    console.log("School updated successfully");
                })
                .catch((error) =>
                    console.error("Error updating school:", error)
                );
        } else {
            console.warn("No school selected for update");
        }
    };

    const handleViewSchoolProfile = () => {
        if (selectedSchool) {
            console.log("View School Profile", selectedSchool);
        } else {
            console.warn("No school selected to view profile");
        }
    };

    return (
        <div className="p-8 h-full w-full flex flex-col items-center">
            <div className="w-full max-w-8xl flex justify-evenly gap-6">
                <div className="flex flex-col gap-6 w-2/9">
                    <Card
                        shadow={true}
                        className="w-full bg-white rounded-xl"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <CardBody
                            className="p-4"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Search & Filter
                            </h2>

                            <div className="relative mb-4">
                                <input
                                    type="search"
                                    placeholder="Search for schools..."
                                    className="h-12 w-full rounded-lg border border-gray-300 px-4 pr-12 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-600">
                                    Division:
                                </label>
                                <select
                                    className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={selectedDivision}
                                    onChange={handleDivisionChange}
                                >
                                    <option value="">All Divisions</option>
                                    {[
                                        ...new Set(
                                            schools.map(
                                                (s) => s.division.division
                                            )
                                        ),
                                    ].map((division) => (
                                        <option key={division} value={division}>
                                            {division}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-600">
                                    Districts:
                                </label>
                                <select
                                    className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={selectedMunicipality}
                                    onChange={handleMunicipalityChange}
                                >
                                    <option value="">All Districts</option>
                                    {[
                                        ...new Set(
                                            schools.map((s) => s.district.name)
                                        ),
                                    ].map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="text-sm font-medium text-gray-600">
                                    Classification:
                                </label>
                                <select
                                    className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={selectedClassification}
                                    onChange={handleClassificationChange}
                                >
                                    <option value="">
                                        All Classifications
                                    </option>
                                    {classificationOptions.map(
                                        (classification) => (
                                            <option
                                                key={classification}
                                                value={classification}
                                            >
                                                {classification}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </CardBody>
                    </Card>

                    <Card
                        shadow={true}
                        className="w-full bg-white rounded-xl"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <CardBody
                            className="p-4 flex flex-col items-center"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                Manage Schools
                            </h2>
                            <div className="flex flex-row flex-wrap gap-4 w-full justify-center">
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
                                        color: "green",
                                        onClick: handleUpdateSchool,
                                    },
                                    {
                                        text: "SCHOOL PROFILE",
                                        color: "amber",
                                        onClick: handleViewSchoolProfile,
                                    },
                                ].map((btn) => (
                                    <Button
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                        key={btn.text}
                                        variant="filled"
                                        color={btn.color as any}
                                        className="flex-grow h-12 min-w-[100px] max-w-[200px] text-white font-bold shadow-md focus:outline-none hover:shadow-lg rounded-lg transition-transform transform hover:scale-105"
                                        onClick={btn.onClick}
                                    >
                                        {btn.text}
                                    </Button>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <Card
                    shadow={true}
                    className="w-4/9 max-w-4xl bg-white rounded-xl overflow-hidden"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    <CardBody
                        className="p-4"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            School Details
                        </h2>

                        <Tabs
                            value={activeTab}
                            onChange={(value: string) => setActiveTab(value)}
                        >
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
                                        className={`flex items-center gap-2 justify-center p-2 ${
                                            activeTab === value
                                                ? "bg-white shadow-md"
                                                : "bg-transparent"
                                        }`}
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
                                {data.map(({ value, content }) => (
                                    <TabPanel key={value} value={value}>
                                        {content}
                                    </TabPanel>
                                ))}
                            </TabsBody>
                        </Tabs>
                    </CardBody>
                </Card>

                <Card
                    shadow={true}
                    className="w-3/9 bg-white rounded-xl h-[85vh]"
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
                            <p>Loading...</p>
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
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Add New School
                        </h2>
                        <div className="space-y-4">
                            {/* School ID */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    School ID:
                                </label>
                                <input
                                    type="text"
                                    value={newSchoolData.schoolId || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            schoolId: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* District */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    District:
                                </label>
                                <select
                                    value={newSchoolData.district?.name || ""}
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

                            {/* School Name */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    School Name:
                                </label>
                                <input
                                    type="text"
                                    value={newSchoolData.name || ""}
                                    onChange={(e) =>
                                        setNewSchoolData({
                                            ...newSchoolData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {/* Classification */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Classification:
                                </label>
                                <select
                                    value={newSchoolData.classification || ""}
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

                            {/* Address */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Address:
                                </label>
                                <textarea
                                    value={newSchoolData.address || ""}
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
        </div>
    );
};

export default SchoolProfile;
