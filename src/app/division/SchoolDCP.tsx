import { useState, useEffect } from "react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getSchoolBatchListBySchoolRecordId } from "../../lib/schoolbatchlist-api/getSchoolBatchListBySchoolRecordId";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { updateSchoolBatchListById } from "../../lib/schoolbatchlist-api/updateSchoolBatchList";
import { createSchoolBatchList } from "../../lib/schoolbatchlist-api/createSchoolBatchList";
import { deleteSchoolBatchListById } from "../../lib/schoolbatchlist-api/deleteSchoolBatchList";

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
    packages: Package[];
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
    id: Id;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
    status: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
}

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

interface Id {
    packageId: number;
    SchoolBatchListId: number;
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
];

const keyStageOptions = [
    "Kinder - Grade 3",
    "Grade 4-6",
    "Grade 7 - 10",
    "Teaching",
    "Non - Teaching",
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
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(false);

    const [packages, setPackages] = useState<Package[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSchoolBatchList, setSelectedSchoolBatchList] =
        useState<SchoolBatchList | null>(null);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getAllBatches();
            console.log("Fetched batches:", data);

            if (!Array.isArray(data)) {
                console.error("Invalid data format: expected an array", data);
                setBatches([]);
                return;
            }

            const transformedData: Batch[] = data.map((item: any) => ({
                ...item,
                schoolBatchList: item.schoolBatchList || [],
                configurations: item.configurations || [],
            }));

            setBatches(transformedData);
        } catch (error) {
            console.error("Failed to fetch batches:", error);
            setBatches([]);
        }
    };

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

        setSelectedSchoolBatchList((prev) =>
            prev ? { ...prev, school } : null
        );

        fetchSchoolBatchList(school.schoolRecordId);
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

    const handleSaveChanges = async () => {
        if (!selectedSchoolBatchList) return;

        console.log(selectedSchoolBatchList);

        try {
            await updateSchoolBatchListById(
                selectedSchoolBatchList.schoolBatchId,
                selectedSchoolBatchList
            );

            setSchoolBatchList([]);
            setSelectedSchool(undefined);
            setShowModal(false);
            console.log("Changes saved successfully");
        } catch (error) {
            console.error("Failed to save changes", error);
        }
    };

    const handleDeleteSchoolBatch = async () => {
        if (!selectedSchoolBatchList) return;

        try {
            await deleteSchoolBatchListById(
                selectedSchoolBatchList.schoolBatchId
            );

            setSchoolBatchList([]);
            setSelectedSchool(undefined);
            setShowModal(false);
            console.log("School batch deleted successfully");
        } catch (error) {
            console.error("Failed to delete school batch", error);
        }
    };

    const handleBatchChange = (batchId: number) => {
        const selectedBatch = batches.find(
            (batch) => batch.batchId === batchId
        );
        if (selectedBatch) {
            setSelectedSchoolBatchList((prev) => {
                if (!prev) return null;
                return { ...prev, batch: selectedBatch };
            });
        }
    };

    const handleDeliveryDateChange = (date: number) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, deliveryDate: date };
        });
    };

    const handleKeyStageChange = (key: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, keyStage: key };
        });
    };

    const handleRemarksChange = (remarks: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, remarks: remarks };
        });
    };

    const handlePackagesChange = (packages: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, numberOfPackage: Number(packages) }; // Convert to number
        });
    };

    const handleAddBatch = async () => {
        console.log("Selected School Batch List:", selectedSchoolBatchList);

        if (!selectedSchoolBatchList) {
            console.warn("No school batch selected. Cannot create batch.");
            return;
        }

        if (!selectedSchool) {
            console.warn("No school batch selected. Cannot create batch.");
            return;
        }

        try {
            await createSchoolBatchList(selectedSchoolBatchList);
            console.log("Batch successfully created!");
            setSchoolBatchList([]);
            setSelectedSchool(undefined);
        } catch (error) {
            console.error("Error creating batch:", error);
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
                            value={
                                selectedSchool?.district.division.division || ""
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
                    {[
                        ...new Set(
                            schools.map((s) => s.district.division.division)
                        ),
                    ].map((division) => (
                        <option key={division} value={division}>
                            {division}
                        </option>
                    ))}
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
            <div className="flex gap-4 h-[55vh]">
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
                    {selectedSchool && (
                        <div className="flex items-center mb-4 gap-2">
                            {/* Batch Selection Dropdown */}
                            <select
                                value={
                                    selectedSchoolBatchList?.batch?.batchId ??
                                    ""
                                }
                                onChange={(e) => {
                                    const batchId = parseInt(
                                        e.target.value,
                                        10
                                    );

                                    setSelectedSchoolBatchList((prev) => {
                                        console.log("Previous State:", prev);
                                        console.log("New Batch ID:", batchId);

                                        return prev
                                            ? {
                                                  ...prev,
                                                  batch: {
                                                      ...prev.batch,
                                                      batchId,
                                                  },
                                              }
                                            : null;
                                    });
                                }}
                                className="p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select a Batch</option>
                                {batches.length > 0 ? (
                                    batches.map((batch) => (
                                        <option
                                            key={batch.batchId}
                                            value={batch.batchId}
                                        >
                                            {batch.batchName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>
                                        No batches available
                                    </option>
                                )}
                            </select>

                            <input
                                type="number"
                                value={
                                    selectedSchoolBatchList?.numberOfPackage ??
                                    0
                                }
                                onChange={(e) => {
                                    const newValue =
                                        e.target.value !== ""
                                            ? parseInt(e.target.value, 10)
                                            : 0;

                                    setSelectedSchoolBatchList((prev) => ({
                                        ...prev!,
                                        numberOfPackage: newValue,
                                    }));

                                    console.log(
                                        "Updated numberOfPackage:",
                                        newValue
                                    );
                                }}
                                min={1}
                                placeholder="Packages"
                                className="p-2 border border-gray-300 rounded-md w-24"
                            />

                            <button
                                onClick={handleAddBatch}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Add Batch
                            </button>
                        </div>
                    )}

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
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-6xl h-[80%] overflow-auto">
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
                                        selectedSchoolBatchList?.school.district
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

                            {/* Batch (Dropdown) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Batch
                                </label>
                                <select
                                    value={
                                        selectedSchoolBatchList?.batch
                                            ?.batchId ||
                                        (batches.length > 0
                                            ? batches[0].batchId
                                            : "")
                                    }
                                    onChange={(e) =>
                                        handleBatchChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    {batches.map((batch) => (
                                        <option
                                            key={batch.batchId}
                                            value={batch.batchId}
                                        >
                                            {batch.batchName || "Batch 1"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Delivery Date (Editable Input) */}
                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={
                                        selectedSchoolBatchList?.deliveryDate ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleDeliveryDateChange(
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Packages
                                </label>
                                <input
                                    type="number"
                                    value={
                                        selectedSchoolBatchList?.numberOfPackage ||
                                        ""
                                    }
                                    onChange={(e) => {
                                        const value = Math.max(
                                            1,
                                            Number(e.target.value)
                                        );
                                        handlePackagesChange(value.toString());
                                    }}
                                    min="1"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Key Stage
                                </label>
                                <select
                                    value={
                                        selectedSchoolBatchList?.keyStage || ""
                                    }
                                    onChange={(e) =>
                                        handleKeyStageChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                >
                                    {keyStageOptions.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
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
                                    onChange={(e) =>
                                        handleRemarksChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
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
                                            key={pkg.id.packageId}
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
                                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                                onClick={handleSaveChanges}
                            >
                                Update
                            </button>
                            <button
                                className="px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                                onClick={handleDeleteSchoolBatch}
                            >
                                Delete
                            </button>
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
