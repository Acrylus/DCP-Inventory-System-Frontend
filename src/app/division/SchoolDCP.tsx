import { useState, useEffect } from "react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";

// Interfaces
interface School {
    schoolRecordId: number;
    schoolId?: string;
    name: string;
    division: Division;
    district: District;
    classification?: string;
}

interface Division {
    name: string;
}

interface District {
    name: string;
}

interface Batch {
    batchId: number;
    batchName: string;
    deliveryYear: number;
    schoolBatchList: SchoolBatchList[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    batch: Batch;
    deliveryDate: string;
    numberOfPackage: number;
    keyStage: string;
}

// Main Component
const SchoolDCP = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [divisionFilter, setDivisionFilter] = useState("All");
    const [municipalityFilter, setMunicipalityFilter] = useState("All");
    const [classificationFilter, setClassificationFilter] = useState("All");

    const [schools, setSchools] = useState<School[]>([]);
    const [dcpDetails, setDcpDetails] = useState<SchoolBatchList[]>([]);

    // Fetch Schools from API
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schoolData: School[] = await getAllSchools();
                setSchools(schoolData);
            } catch (error) {
                console.error("Error fetching schools:", error);
            }
        };
        fetchSchools();
    }, []);

    // Fetch DCP details from API
    useEffect(() => {
        const fetchDCPDetails = async () => {
            try {
                const batchData: Batch[] = await getAllBatches();
                const allDcpDetails = batchData.flatMap(
                    (batch) => batch.schoolBatchList
                );
                setDcpDetails(allDcpDetails);
            } catch (error) {
                console.error("Error fetching DCP details:", error);
            }
        };
        fetchDCPDetails();
    }, []);

    // Filter schools based on search & filters
    const filteredSchools = schools.filter(
        (school) =>
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (divisionFilter === "All" ||
                school.division.name === divisionFilter) &&
            (municipalityFilter === "All" ||
                school.district.name === municipalityFilter) &&
            (classificationFilter === "All" ||
                school.classification === classificationFilter)
    );

    // Filter DCP details based on selected school
    const filteredDCPs = selectedSchool
        ? dcpDetails.filter((dcp) => dcp.school.schoolId === selectedSchool)
        : [];

    return (
        <div className="w-full max-w-7xl mx-auto p-4 text-black">
            {/* School Information Section */}
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
                                    ? schools.find(
                                          (s) => s.schoolId === selectedSchool
                                      )?.division.name || ""
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
                                    ? schools.find(
                                          (s) => s.schoolId === selectedSchool
                                      )?.district.name || ""
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
                                    ? schools.find(
                                          (s) => s.schoolId === selectedSchool
                                      )?.name || ""
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
                {/* School List */}
                <div className="w-1/3 border rounded-lg p-4 overflow-auto max-h-96">
                    <h2 className="text-lg font-bold mb-3">School List</h2>
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
                            {filteredSchools.map((school) => (
                                <tr
                                    key={school.schoolRecordId}
                                    className={`cursor-pointer hover:bg-emerald-100 ${
                                        selectedSchool === school.schoolId
                                            ? "bg-emerald-200"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedSchool(school.schoolId || "")
                                    }
                                >
                                    <td className="px-4 py-2 border border-slate-300">
                                        {school.schoolId}
                                    </td>
                                    <td className="px-4 py-2 border border-slate-300">
                                        {school.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* DCP Details */}
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDCPs.map((dcp) => (
                                <tr key={dcp.schoolBatchId}>
                                    <td>{dcp.batch.batchName}</td>
                                    <td>{dcp.deliveryDate}</td>
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
