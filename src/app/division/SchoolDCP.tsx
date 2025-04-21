import { useState, useEffect } from "react";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getSchoolBatchListBySchoolRecordId } from "../../lib/schoolbatchlist-api/getSchoolBatchListBySchoolRecordId";
import { getPackagesBySchoolBatchId } from "../../lib/package-api/getPackageBySchoolBatchId";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { updateSchoolBatchListById } from "../../lib/schoolbatchlist-api/updateSchoolBatchList";
import { createSchoolBatchList } from "../../lib/schoolbatchlist-api/createSchoolBatchList";
import { deleteSchoolBatchListById } from "../../lib/schoolbatchlist-api/deleteSchoolBatchList";
import { updatePackagesBySchoolBatch } from "../../lib/package-api/updatePackageBySchoolBatchId";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    configurations: Configuration[];
}

interface SchoolBatchList {
    schoolBatchId: number;
    batch: Batch;
    school: School;
    deliveryDate: string;
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
    email: string;
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

interface Id {
    packageId: number;
    SchoolBatchListId: number;
}

interface Configuration {
    id: ConfigurationId;
    item: string;
    type: string;
    quantity: number;
}

interface ConfigurationId {
    configurationId: number;
    batchId: number;
}

const classificationOptions = [
    "PRIMARY",
    "ELEMENTARY",
    "JUNIOR HIGH SCHOOL",
    "SENIOR HIGH SCHOOL",
    "BOTH(JHS/SHS)",
    "INTEGRATED",
    "DIVISION",
];

const keyStageOptions = [
    "PRIMARY",
    "KINDER-GRADE 3",
    "GRADE 4-6",
    "ELEMENTARY",
    "JUNIOR HIGH SCHOOL",
    "SENIOR HIGH SCHOOL",
    "BOTH(JHS/SHS)",
    "INTEGRATED",
    "TEACHING",
    "NON-TEACHING",
];

const statusOptions = [
    "UNSERVICEABLE",
    "SERVICEABLE",
    "FUNCTIONAL",
    "NON FUNCTIONAL",
    "FOR RELIEF OF ACCOUNTABILITY",
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

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error"
    >("success");

    useEffect(() => {
        const fetchSchools = async () => {
            setLoading(true); // Start loading
            try {
                const data: School[] = await getAllSchools();
                setSchools(data);
            } catch (error) {
                console.error("Error fetching schools:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        const fetchBatches = async () => {
            setLoading(true); // Start loading
            try {
                const data = await getAllBatches();
                console.log("Fetched batches:", data);

                if (!Array.isArray(data)) {
                    console.error(
                        "Invalid data format: expected an array",
                        data
                    );
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
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchBatches();
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
            setSnackbarMessage("Data is still loading. Please wait...");
            setSnackbarSeverity("error");
            setOpenSnackbar(true); // Show the Snackbar
            return;
        }

        if (!school) {
            console.warn("No school selected.");
            setSchoolBatchList([]);
            setSnackbarMessage("No school selected.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true); // Show the Snackbar
            return;
        }

        console.error("SCHOOL SELECTED", school);

        setSelectedSchool(school);
        setSelectedSchoolBatchList({
            school,
            schoolBatchId: 0, // Default value
            batch: {
                batchId: 0,
                batchName: "No Batch",
                budgetYear: 0,
                deliveryYear: 0,
                price: 0,
                supplier: "",
                numberOfPackage: 0,
                remarks: "", // Added remarks
                configurations: [], // Assuming an array for configurations
            },
            deliveryDate: "",
            numberOfPackage: 1,
            status: "pending", // Added status (check your enum or string values for this)
            keyStage: "", // Added keyStage (check what it should be)
            packages: [], // Empty array for packages
            accountable: "",
            remarks: "",
        });

        setSnackbarMessage(`School selected: ${school.name}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true); // Show the Snackbar

        fetchSchoolBatchList(school.schoolRecordId);
    };

    const filteredSchools = schools.filter((school) => {
        const matchesSearchQuery =
            school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.schoolId.toString().includes(searchQuery);

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
        setSnackbarMessage(`Division selected: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleDistrictChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDistrict(event.target.value);
        setSnackbarMessage(`District selected: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleClassificationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedClassification(event.target.value);
        setSnackbarMessage(`Classification selected: ${event.target.value}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
    };

    const handleSelectSchoolBatchList = async (
        schoolBatchList: SchoolBatchList
    ) => {
        setSelectedSchoolBatchList(schoolBatchList);
        setShowModal(true);
        setLoading(true); // Show loading indicator

        try {
            const packagesData = await getPackagesBySchoolBatchId(
                schoolBatchList.schoolBatchId
            );
            console.log("Fetched packages:", packagesData);
            setPackages(Array.isArray(packagesData) ? packagesData : []);
            setSnackbarMessage("Packages fetched successfully!");
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Failed to fetch packages:", error);
            setPackages([]);
            setSnackbarMessage("Failed to fetch packages.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        } finally {
            setLoading(false); // Hide loading indicator after operation
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedSchoolBatchList) {
            setSnackbarMessage(
                "No school batch selected. Cannot create batch."
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!selectedSchool) {
            setSnackbarMessage("No school selected. Cannot create batch.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true); // Show loading indicator
        setSnackbarMessage("Saving changes..."); // Show saving message
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        console.log(selectedSchoolBatchList);

        try {
            await updateSchoolBatchListById(
                selectedSchoolBatchList.schoolBatchId,
                selectedSchoolBatchList
            );

            setShowModal(false);
            fetchSchoolBatchList(selectedSchool.schoolRecordId);
            setSnackbarMessage("Changes saved successfully!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to save changes", error);
            setSnackbarMessage("Failed to save changes.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false); // Hide loading indicator after operation
        }
    };

    const handleUpdatePackages = async () => {
        if (!selectedSchoolBatchList) return;

        setLoading(true);
        setSnackbarMessage("Updating packages...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        try {
            await updatePackagesBySchoolBatch(
                selectedSchoolBatchList.schoolBatchId,
                packages
            );

            setSnackbarMessage("Packages updated successfully!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to update packages", error);
            setSnackbarMessage("Failed to update packages.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSchoolBatch = async () => {
        if (!selectedSchoolBatchList) {
            setSnackbarMessage(
                "No school batch selected. Cannot create batch."
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!selectedSchool) {
            setSnackbarMessage("No school selected. Cannot create batch.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true); // Show loading indicator
        setSnackbarMessage("Deleting school batch...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        try {
            await deleteSchoolBatchListById(
                selectedSchoolBatchList.schoolBatchId
            );
            fetchSchoolBatchList(selectedSchool.schoolRecordId);
            setShowModal(false);
            setSnackbarMessage("School batch deleted successfully!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Failed to delete school batch", error);
            setSnackbarMessage("Failed to delete school batch.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false); // Hide loading indicator
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
            setSnackbarMessage(`Batch selected: ${selectedBatch.batchName}`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        }
    };

    const handleDeliveryDateChange = (dateString: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, deliveryDate: dateString };
        });
        setSnackbarMessage(`Delivery date set to: ${dateString}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
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

    const handleStatusChange = (status: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, status: status };
        });
    };

    const handleAccountableChange = (accountable: string) => {
        setSelectedSchoolBatchList((prev) => {
            if (!prev) return null;
            return { ...prev, accountable: accountable };
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
            setSnackbarMessage(
                "No school batch selected. Cannot create batch."
            );
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        if (!selectedSchool) {
            setSnackbarMessage("No school selected. Cannot create batch.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
            return;
        }

        setLoading(true); // Show loading indicator
        setSnackbarMessage("Creating batch...");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        try {
            const { schoolBatchId, ...batchWithoutId } =
                selectedSchoolBatchList;

            await createSchoolBatchList(batchWithoutId);
            console.log("Batch successfully created!");
            setSnackbarMessage("Batch successfully created!");
            setSnackbarSeverity("success");
            fetchSchoolBatchList(selectedSchool.schoolRecordId);
        } catch (error) {
            console.error("Error creating batch:", error);
            setSnackbarMessage("Error creating batch.");
            setSnackbarSeverity("error");
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    const handleInputChange = (
        index: number,
        field: keyof Package,
        value: any
    ) => {
        setPackages((prevPackages) => {
            return prevPackages.map((pkg, i) =>
                i === index ? { ...pkg, [field]: value } : pkg
            );
        });
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

                            <select
                                value={selectedSchoolBatchList?.keyStage || ""}
                                onChange={(e) =>
                                    handleKeyStageChange(e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded-md bg-white"
                            >
                                <option value="" disabled>
                                    Select a key stage
                                </option>
                                {keyStageOptions.map((stage) => (
                                    <option key={stage} value={stage}>
                                        {stage}
                                    </option>
                                ))}
                            </select>

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
                                    onChange={(e) =>
                                        handleDeliveryDateChange(e.target.value)
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
                                    <option value="" disabled>
                                        Select a key stage
                                    </option>
                                    {keyStageOptions.map((stage) => (
                                        <option key={stage} value={stage}>
                                            {stage}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Status
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.status || ""
                                    }
                                    onChange={(e) =>
                                        handleStatusChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></input>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Accountable
                                </label>
                                <input
                                    value={
                                        selectedSchoolBatchList?.accountable ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handleAccountableChange(e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                ></input>
                            </div>

                            <div className="col-span-3">
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

                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border border-gray-200 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700">
                                        <th className="px-4 py-3 text-sm font-medium border border-gray-300 text-center">
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

                                            {/* Item (Read-only) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={
                                                        pkg.configuration
                                                            .item ?? ""
                                                    }
                                                    readOnly
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                                                />
                                            </td>

                                            <td className="px-4 py-3 border border-gray-300">
                                                <select
                                                    value={pkg.status ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        pkg.status ===
                                                        "For relief of accountability"
                                                    }
                                                    className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                        pkg.status ===
                                                        "For relief of accountability"
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    {statusOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </td>

                                            {/* Serial Number (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={
                                                        pkg.serialNumber ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "serialNumber",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>

                                            {/* Assigned (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={pkg.assigned ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "assigned",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>

                                            {/* Remarks (Editable) */}
                                            <td className="px-4 py-3 border border-gray-300">
                                                <input
                                                    type="text"
                                                    value={pkg.remarks ?? ""}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            "remarks",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                                onClick={handleSaveChanges}
                            >
                                Update DCP
                            </button>
                            <button
                                className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                                onClick={handleUpdatePackages}
                            >
                                Update Items
                            </button>
                            <button
                                className="px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
                                onClick={handleDeleteSchoolBatch}
                            >
                                Delete
                            </button>
                            <button
                                className="px-5 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
                                onClick={() => {
                                    setShowModal(false);
                                    setSchoolBatchList([]);
                                    setSelectedSchool(undefined);
                                }}
                            >
                                Close
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

            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        </div>
    );
};

export default SchoolDCP;
