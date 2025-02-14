import { useState } from "react";

const SchoolDCP = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [divisionFilter, setDivisionFilter] = useState("All");
    const [municipalityFilter, setMunicipalityFilter] = useState("All");
    const [classificationFilter, setClassificationFilter] = useState("All");

    // Sample Data (Replace with API Data)
    const schoolList = [
        {
            schoolID: "119311",
            schoolName: "ABLAYAN ELEMENTARY SCHOOL",
            division: "Cebu Province",
            municipality: "Dalaguete",
            classification: "Elementary",
        },
        {
            schoolID: "119703",
            schoolName: "ABUGON ELEMENTARY SCHOOL",
            division: "Cebu Province",
            municipality: "Sibonga",
            classification: "Elementary",
        },
    ];

    const dcpDetails = [
        {
            batchNo: "DCP FY2025",
            deliveryDate: "2025-02-01",
            numOfPkg: 1,
            keyStage: "",
            remarks: "",
            schoolID: "119311",
        },
        {
            batchNo: "Batch 19",
            deliveryDate: "2024-06-15",
            numOfPkg: 1,
            keyStage: "Grade 4-6",
            remarks: "",
            schoolID: "119311",
        },
        {
            batchNo: "Batch 29",
            deliveryDate: "2024-04-10",
            numOfPkg: 1,
            keyStage: "Kinder-Grade 3",
            remarks: "",
            schoolID: "119311",
        },
    ];

    // Filter schools based on search & dropdowns
    const filteredSchools = schoolList.filter(
        (school) =>
            school.schoolName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) &&
            (divisionFilter === "All" || school.division === divisionFilter) &&
            (municipalityFilter === "All" ||
                school.municipality === municipalityFilter) &&
            (classificationFilter === "All" ||
                school.classification === classificationFilter)
    );

    // Filter DCP Details based on selected school
    const filteredDCPs = selectedSchool
        ? dcpDetails.filter((dcp) => dcp.schoolID === selectedSchool)
        : [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 text-black">
            {/* Top Section - School Info */}
            <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                    School Information
                </h2>
                <div className="grid grid-cols-4 gap-4 mt-2">
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Division
                        </label>
                        <input
                            type="text"
                            value={
                                selectedSchool
                                    ? schoolList.find(
                                          (s) => s.schoolID === selectedSchool
                                      )?.division || ""
                                    : ""
                            }
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Municipality
                        </label>
                        <input
                            type="text"
                            value={
                                selectedSchool
                                    ? schoolList.find(
                                          (s) => s.schoolID === selectedSchool
                                      )?.municipality || ""
                                    : ""
                            }
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            School ID
                        </label>
                        <input
                            type="text"
                            value={selectedSchool || ""}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            School Name
                        </label>
                        <input
                            type="text"
                            value={
                                selectedSchool
                                    ? schoolList.find(
                                          (s) => s.schoolID === selectedSchool
                                      )?.schoolName || ""
                                    : ""
                            }
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                            disabled
                        />
                    </div>
                </div>
            </div>

            {/* Search Bar & Filters */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <input
                    type="search"
                    placeholder="Search School"
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={divisionFilter}
                    onChange={(e) => setDivisionFilter(e.target.value)}
                >
                    <option value="All">All Divisions</option>
                    <option value="Cebu Province">Cebu Province</option>
                </select>
                <select
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={municipalityFilter}
                    onChange={(e) => setMunicipalityFilter(e.target.value)}
                >
                    <option value="All">All Municipalities</option>
                    <option value="Dalaguete">Dalaguete</option>
                    <option value="Sibonga">Sibonga</option>
                </select>
                <select
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={classificationFilter}
                    onChange={(e) => setClassificationFilter(e.target.value)}
                >
                    <option value="All">All Classifications</option>
                    <option value="Elementary">Elementary</option>
                </select>
            </div>

            {/* Two-Column Layout */}
            <div className="flex gap-4">
                {/* School List (Left - 1/3 Width) */}
                <div className="w-1/3 border rounded-lg p-4 overflow-auto max-h-96">
                    <h2 className="text-lg font-bold mb-3">School List</h2>
                    <div className="overflow-auto max-h-80">
                        <table className="w-full border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 border border-slate-300">
                                        School ID
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        School Name
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchools.map((school, index) => (
                                    <tr
                                        key={index}
                                        className={`cursor-pointer hover:bg-emerald-100 ${
                                            selectedSchool === school.schoolID
                                                ? "bg-emerald-200"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedSchool(school.schoolID)
                                        }
                                    >
                                        <td className="px-4 py-2 border border-slate-300">
                                            {school.schoolID}
                                        </td>
                                        <td className="px-4 py-2 border border-slate-300">
                                            {school.schoolName}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* DCP Details (Right - 2/3 Width) */}
                <div className="w-2/3 border rounded-lg p-4 overflow-auto max-h-96">
                    <h2 className="text-lg font-bold mb-3">DCP Details</h2>
                    <table className="w-full border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="px-4 py-2 border border-slate-300">
                                    Batch#
                                </th>
                                <th className="px-4 py-2 border border-slate-300">
                                    Delivery Date
                                </th>
                                <th className="px-4 py-2 border border-slate-300">
                                    # Package
                                </th>
                                <th className="px-4 py-2 border border-slate-300">
                                    Key Stage
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDCPs.map((dcp, index) => (
                                <tr key={index} className="hover:bg-slate-100">
                                    <td>{dcp.batchNo}</td>
                                    <td>{dcp.deliveryDate}</td>
                                    <td>{dcp.numOfPkg}</td>
                                    <td>{dcp.keyStage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SchoolDCP;
