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
const SchoolProfile = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

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

    const filteredSchools = schools.filter((school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-8xl grid grid-cols-3 gap-6">
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
                        {["Division", "Municipality", "Classification"].map(
                            (label) => (
                                <div key={label} className="mb-4">
                                    <label className="text-sm font-medium text-gray-600">
                                        {label}:
                                    </label>
                                    <select className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400">
                                        <option value="" disabled selected>
                                            Select {label}
                                        </option>
                                    </select>
                                </div>
                            )
                        )}
                    </CardBody>
                </Card>

                {/* Manage Schools & School Details - Side by Side */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                    {/* Manage Schools */}
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
                            <div className="grid grid-cols-2 gap-4 w-full">
                                {[
                                    { text: "ADD", color: "blue" },
                                    { text: "DELETE", color: "red" },
                                    { text: "UPDATE", color: "green" },
                                    { text: "SCHOOL PROFILE", color: "amber" },
                                ].map((btn) => (
                                    <Button
                                        key={btn.text}
                                        variant="filled"
                                        color={btn.color as any}
                                        className="w-full h-14 min-w-[150px] text-white font-bold shadow-md focus:outline-none hover:shadow-lg rounded-lg transition-transform transform hover:scale-105"
                                        placeholder=""
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                    >
                                        {btn.text}
                                    </Button>
                                ))}
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
                            className="p-4"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                School Details
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Record No.", type: "text" },
                                    { label: "Division", type: "text" },
                                    { label: "Municipality", type: "dropdown" },
                                    {
                                        label: "Classification",
                                        type: "dropdown",
                                    },
                                    { label: "School ID", type: "text" },
                                    { label: "School Name", type: "text" },
                                ].map((field, index) => (
                                    <div key={index} className="col-span-1">
                                        <label className="text-sm font-medium text-gray-600">
                                            {field.label}:
                                        </label>
                                        {field.type === "dropdown" ? (
                                            <select className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400">
                                                <option
                                                    value=""
                                                    disabled
                                                    selected
                                                >
                                                    Select {field.label}
                                                </option>
                                            </select>
                                        ) : (
                                            <input
                                                type="text"
                                                className="h-12 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
                                            />
                                        )}
                                    </div>
                                ))}

                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">
                                        Address:
                                    </label>
                                    <textarea className="h-20 w-full mt-1 rounded-lg border border-gray-300 px-4 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-400"></textarea>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {selectedSchool && (
                <div className="mt-6 w-full max-w-4xl">
                    <Card
                        shadow={true}
                        className="bg-white rounded-xl"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        <CardBody
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                School Details
                            </h2>
                            <p>
                                <strong>ID:</strong> {selectedSchool.schoolId}
                            </p>
                            <p>
                                <strong>Name:</strong> {selectedSchool.name}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {selectedSchool.address ||
                                    "No address available"}
                            </p>
                        </CardBody>
                    </Card>
                </div>
            )}

            <div className="w-full max-w-7xl mt-6">
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
                            School List
                        </h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="w-full overflow-x-auto mt-4">
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
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
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
