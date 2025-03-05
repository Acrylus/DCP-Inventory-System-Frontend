import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@material-tailwind/react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { createSchool } from "../../lib/school-api/createSchool";
import { updateSchoolById } from "../../lib/school-api/updateSchool";
import { deleteSchoolById } from "../../lib/school-api/deleteSchool";

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
        console.log("Add School");
        if (selectedSchool) {
            createSchool(selectedSchool)
                .then(() => {
                    fetchSchools();
                    setSelectedSchool(null);
                    console.log("School added successfully");
                })
                .catch((error) => console.error("Error adding school:", error));
        } else {
            console.warn("No school data provided for addition");
        }
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
            // Implement navigation or view logic here
        } else {
            console.warn("No school selected to view profile");
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (selectedSchool) {
            const fieldParts = field.split(".");
            if (fieldParts.length === 1) {
                // Direct field update
                setSelectedSchool({
                    ...selectedSchool,
                    [field]: value,
                });
            } else if (fieldParts.length === 2) {
                // Nested field update (e.g., "division.division")
                const parentField = fieldParts[0] as keyof School;
                const nestedField = fieldParts[1];

                setSelectedSchool({
                    ...selectedSchool,
                    [parentField]: {
                        ...((selectedSchool[parentField] as object) || {}),
                        [nestedField]: value,
                    },
                });
            }
        }
    };

    return (
        <div className="p-8 h-full w-full flex flex-col items-center">
            <div className="w-full max-w-8xl flex justify-evenly gap-6">
                <div className="flex flex-col gap-6 w-2/10">
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
                                        className="flex-grow h-14 min-w-[100px] max-w-[200px] text-white font-bold shadow-md focus:outline-none hover:shadow-lg rounded-lg transition-transform transform hover:scale-105"
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
                    className="w-5/10 max-w-4xl bg-white rounded-xl overflow-hidden"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                {
                                    label: "Record No.",
                                    field: "schoolRecordId",
                                    type: "text",
                                    value: String(
                                        selectedSchool?.schoolRecordId || ""
                                    ),
                                },
                                {
                                    label: "School ID",
                                    field: "schoolId",
                                    type: "text",
                                    value: selectedSchool?.schoolId || "",
                                },
                                {
                                    label: "School Name",
                                    field: "name",
                                    type: "text",
                                    value: selectedSchool?.name || "",
                                },
                                {
                                    label: "Division",
                                    field: "division.division",
                                    type: "text",
                                    value:
                                        selectedSchool?.division?.division ||
                                        "",
                                },
                                {
                                    label: "Municipality",
                                    field: "district.name",
                                    type: "text",
                                    value: selectedSchool?.district?.name || "",
                                },
                                {
                                    label: "Landline",
                                    field: "landline",
                                    type: "text",
                                    value: selectedSchool?.landline || "",
                                },
                                {
                                    label: "School Head",
                                    field: "schoolHead",
                                    type: "text",
                                    value: selectedSchool?.schoolHead || "",
                                },
                                {
                                    label: "School Head Number",
                                    field: "schoolHeadNumber",
                                    type: "text",
                                    value:
                                        selectedSchool?.schoolHeadNumber || "",
                                },
                                {
                                    label: "School Head Email",
                                    field: "schoolHeadEmail",
                                    type: "email",
                                    value:
                                        selectedSchool?.schoolHeadEmail || "",
                                },
                                {
                                    label: "Property Custodian",
                                    field: "propertyCustodian",
                                    type: "text",
                                    value:
                                        selectedSchool?.propertyCustodian || "",
                                },
                                {
                                    label: "Custodian Number",
                                    field: "propertyCustodianNumber",
                                    type: "text",
                                    value:
                                        selectedSchool?.propertyCustodianNumber ||
                                        "",
                                },
                                {
                                    label: "Custodian Email",
                                    field: "propertyCustodianEmail",
                                    type: "email",
                                    value:
                                        selectedSchool?.propertyCustodianEmail ||
                                        "",
                                },
                                {
                                    label: "NTC Remark",
                                    field: "ntcRemark",
                                    type: "text",
                                    value: selectedSchool?.ntcRemark || "",
                                },
                                {
                                    label: "Designation",
                                    field: "designation",
                                    type: "text",
                                    value: selectedSchool?.designation || "",
                                },
                                {
                                    label: "Previous Station",
                                    field: "previousStation",
                                    type: "text",
                                    value:
                                        selectedSchool?.previousStation || "",
                                },
                            ].map((field, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600">
                                        {field.label}:
                                    </label>
                                    <input
                                        type={field.type}
                                        value={field.value}
                                        onChange={(e) =>
                                            handleInputChange(
                                                field.field,
                                                e.target.value
                                            )
                                        }
                                        className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    />
                                </div>
                            ))}

                            {[
                                { label: "Energized", field: "energized" },
                                {
                                    label: "Local Grid Supply",
                                    field: "localGridSupply",
                                },
                                {
                                    label: "Connectivity",
                                    field: "connectivity",
                                },
                                { label: "Smart", field: "smart" },
                                { label: "Globe", field: "globe" },
                                {
                                    label: "Digital Network",
                                    field: "digitalNetwork",
                                },
                                { label: "AM Radio", field: "am" },
                                { label: "FM Radio", field: "fm" },
                                { label: "TV Access", field: "tv" },
                                { label: "Cable Access", field: "cable" },
                            ].map((checkbox, index) => (
                                <div key={index} className="flex items-center">
                                    <label className="text-sm font-medium text-gray-600 mr-2">
                                        {checkbox.label}:
                                    </label>
                                    <input
                                        type="checkbox"
                                        checked={Boolean(
                                            selectedSchool?.[
                                                checkbox.field as keyof School
                                            ]
                                        )}
                                        onChange={(e) =>
                                            handleInputChange(
                                                checkbox.field,
                                                e.target.checked
                                                    ? "true"
                                                    : "false"
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col col-span-1">
                                <label className="text-sm font-medium text-gray-600">
                                    Classification:
                                </label>
                                <select
                                    className="h-10 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={selectedSchool?.classification || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "classification",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="" disabled>
                                        Select Classification
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

                            <div className="flex flex-col col-span-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Address:
                                </label>
                                <textarea
                                    className="h-20 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                    value={selectedSchool?.address || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                ></textarea>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card
                    shadow={true}
                    className="w-3/10 bg-white rounded-xl h-[85vh]"
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
        </div>
    );
};

export default SchoolProfile;
