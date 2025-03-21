import { useState, useEffect } from "react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getSchoolBatchListBySchoolRecordId } from "../../lib/schoolbatchlist-api/getSchoolBatchListBySchoolRecordId";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: string;
    deliveryYear: string;
    price: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configurations: Configuration[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: number;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
}

interface School {
    schoolRecordId: number;
    schoolId: string;
    name: string;
    address: string;
    division: Division;
    district: District;
    classification?: string;
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

interface District {
    districtId: number;
    name: string;
    division: Division;
}

interface Package {
    packageId: number;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    item: string;
    type: string;
    quantity: number;
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

const SchoolDCP = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<School>();
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedClassification, setSelectedClassification] = useState("");

    const [schools, setSchools] = useState<School[]>([]);
    const [schoolBatchList, setSchoolBatchList] = useState<SchoolBatchList[]>(
        []
    );

    const [loading, setLoading] = useState(false);

    const [packages, setPackages] = useState<Package[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSchoolBatchList, setSelectedSchoolBatchList] =
        useState<SchoolBatchList | null>(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data: School[] = await getAllSchools();
                setSchools(data);
            } catch (error) {
                console.error("Error fetching schools:", error);
            }
        };
        fetchSchools();
    }, []);

    const fetchSchoolBatchList = async (schoolRecordId?: number) => {
        if (!schoolRecordId) {
            console.warn("School Record Id is missing or invalid");
            setSchoolBatchList([]);
            return;
        }

        try {
            setLoading(true);
            const data = await getSchoolBatchListBySchoolRecordId(
                schoolRecordId
            );
            console.log(
                `Fetched school batch list for batch ${schoolRecordId}:`,
                data
            );
            setSchoolBatchList(data || []);
        } catch (error) {
            console.error("Failed to fetch school batch list:", error);
            setSchoolBatchList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSchoolSelection = (school: School | null) => {
        if (loading) {
            console.warn("Data is still loading. Please wait...");
            return;
        }

        if (!school) {
            console.warn("No school selected.");
            setSchoolBatchList([]);
            return;
        }

        console.error("SCHOOL SELECTED", school);

        setSelectedSchool(school);
        fetchSchoolBatchList(school.schoolRecordId);
    };

    const filteredSchools = schools.filter((school) => {
        const matchesSearchQuery = school.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesDivision = selectedDivision
            ? school.division.division === selectedDivision
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
    };

    const handleDistrictChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDistrict(event.target.value);
    };

    const handleClassificationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedClassification(event.target.value);
    };

    const handleSelectSchoolBatchList = async (
        schoolBatchList: SchoolBatchList
    ) => {
        setSelectedSchoolBatchList(schoolBatchList);
        setShowModal(true);

        try {
            const packagesData = await getPackagesBySchoolBatchId(
                schoolBatchList.schoolBatchId
            );
            console.log("Fetched packages:", packagesData);
            setPackages(Array.isArray(packagesData) ? packagesData : []);
        } catch (error) {
            console.error("Failed to fetch packages:", error);
            setPackages([]);
        }
    };

    return (
        <div className="w-full p-8 text-black flex flex-col h-[75%]">
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
                            value={selectedSchool?.division?.division || ""}
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
                            value={selectedSchool?.district?.name || ""}
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
                            value={selectedSchool?.schoolId || ""}
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
                            value={selectedSchool?.name || ""}
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
                    value={selectedDivision}
                    onChange={handleDivisionChange}
                >
                    <option value="">All Divisions</option>
                    {[...new Set(schools.map((s) => s.division.division))].map(
                        (division) => (
                            <option key={division} value={division}>
                                {division}
                            </option>
                        )
                    )}
                </select>
                <select
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                >
                    <option value="">All Districts</option>
                    {[...new Set(schools.map((s) => s.district.name))].map(
                        (district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        )
                    )}
                </select>
                <select
                    className="col-span-1 h-10 px-4 text-sm border border-gray-300 rounded-md"
                    value={selectedClassification}
                    onChange={handleClassificationChange}
                >
                    <option value="">All Classifications</option>
                    {classificationOptions.map((classification) => (
                        <option key={classification} value={classification}>
                            {classification}
                        </option>
                    ))}
                </select>
            </div>

            {/* Two-Column Layout */}
            <div className="flex gap-4 h-full">
                {/* School List */}
                <div className="w-1/3 border rounded-lg p-4 overflow-auto">
                    <h2 className="text-lg font-bold mb-3">School List</h2>
                    <table className="w-full border-collapse border border-slate-200">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="px-4 py-2 border">School ID</th>
                                <th className="px-4 py-2 border">
                                    School Name
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchools.map((school) => (
                                <tr
                                    key={school.schoolRecordId}
                                    className={`cursor-pointer hover:bg-emerald-100 ${
                                        selectedSchool?.schoolId ===
                                        school.schoolId
                                            ? "bg-emerald-200"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleSchoolSelection(school)
                                    }
                                >
                                    <td className="px-4 py-2 border">
                                        {school.schoolId}
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {school.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="w-2/3 border rounded-lg p-4 overflow-auto">
                    <h2 className="text-lg font-bold mb-3">DCP Details</h2>
                    <div className="overflow-auto">
                        <table className="w-full border-collapse border border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="px-4 py-2 border border-slate-300">
                                        Batch
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Delivery Date
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Number of Package
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Key Stage
                                    </th>
                                    <th className="px-4 py-2 border border-slate-300">
                                        Remarks
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : Array.isArray(schoolBatchList) &&
                                  schoolBatchList.length > 0 ? (
                                    schoolBatchList.map((sbl) => (
                                        <tr
                                            key={
                                                sbl.schoolBatchId ||
                                                Math.random()
                                            }
                                            className="cursor-pointer hover:bg-gray-200"
                                            onClick={() =>
                                                handleSelectSchoolBatchList(sbl)
                                            }
                                        >
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.batch.batchName}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.deliveryDate}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.numberOfPackage}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.keyStage}
                                            </td>
                                            <td className="px-4 py-2 border border-slate-300">
                                                {sbl.remarks}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-4 text-gray-500"
                                        >
                                            {selectedSchool
                                                ? "No DCP found for this school."
                                                : "Select a batch to view details."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && selectedSchoolBatchList && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            School Details
                        </h2>

                        <div className="grid grid-cols-3 gap-4 mt-2">
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Division
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.school
                                            ?.division?.division || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    District
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.school
                                            ?.district?.name || ""
                                    }
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
                                        selectedSchoolBatchList?.school?.name ||
                                        ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Batch
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.batch
                                            ?.batchName || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Delivery Date
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.deliveryDate ||
                                        ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Packages
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.numberOfPackage ||
                                        ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Key Stage
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.keyStage || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-gray-600">
                                    Remarks
                                </label>
                                <input
                                    type="text"
                                    value={
                                        selectedSchoolBatchList?.remarks || ""
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-200"
                                    disabled
                                />
                            </div>
                        </div>

                        {/* Modernized Table */}
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Number
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Serial Number
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Assigned
                                        </th>
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map((pkg, index) => (
                                        <tr
                                            key={pkg.packageId}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 border border-gray-300 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-300">
                                                {pkg.configuration.item}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-300">
                                                {pkg.status}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-300">
                                                {pkg.serialNumber}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-300">
                                                {pkg.assigned}
                                            </td>
                                            <td className="px-4 py-3 border border-gray-300">
                                                {pkg.remarks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Close Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolDCP;
