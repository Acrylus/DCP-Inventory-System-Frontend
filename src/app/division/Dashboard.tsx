import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@material-tailwind/react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import {
    Square3Stack3DIcon,
    UserCircleIcon,
    Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { getAllBatches } from "../../lib/batch-api/getAllBatch";
import { getAllSchools } from "../../lib/school-api/getAllSchool";
import { getAllSchoolBatchLists } from "../../lib/schoolbatchlist-api/getAllSchoolBatchList";
import { Box, CircularProgress } from "@mui/material";

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

interface SchoolBatchList {
    schoolBatchId: SchoolBatchList;
    batch: Batch;
    school: School;
    deliveryDate: Date | null;
    numberOfPackages: string;
    component: string;
    serialNumber: string;
    assigned: string;
    remarks: string;
    package: Package;
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

interface Batch {
    batchId: number;
    batchName: string;
    batchYear: string;
    deliveryYear: string;
    supplier: string;
    numberOfPackage: string;
    remarks: string;
    configuration: Configuration;
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

const classificationOptions = [
    "ELEMENTARY",
    "SECONDARY",
    "JUNIOR HIGH SCHOOL",
    "SENIOR HIGH SCHOOL",
    "INTEGRATED",
    "DIVISION",
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dcp-package");

    const [batches, setBatches] = useState<Batch[]>([]);
    const [schools, setSchools] = useState<School[]>([]);

    const [schoolBatches, setSchoolBatches] = useState<SchoolBatchList[]>([]);
    const [loading, setLoading] = useState(true);

    const classifySchools = (
        schools: School[],
        schoolBatches: SchoolBatchList[] | undefined
    ) => {
        if (!Array.isArray(schoolBatches)) {
            console.error(
                "Error: schoolBatches is not an array",
                schoolBatches
            );
            return [];
        }

        const classificationCounts: Record<
            string,
            { withDCP: number; withoutDCP: number }
        > = {};

        // ✅ Get all school IDs that already have a DCP
        const schoolsWithDCPSet = new Set(
            schoolBatches.map(
                (schoolBatch) => schoolBatch.school.schoolRecordId
            )
        );

        // ✅ Iterate over all schools instead of just schoolBatches
        schools.forEach((school) => {
            const classification = school.classification || "Unknown";

            if (!classificationCounts[classification]) {
                classificationCounts[classification] = {
                    withDCP: 0,
                    withoutDCP: 0,
                };
            }

            // ✅ If the school is in schoolBatches, it has a DCP
            if (schoolsWithDCPSet.has(school.schoolRecordId)) {
                classificationCounts[classification].withDCP += 1;
            } else {
                classificationCounts[classification].withoutDCP += 1;
                console.log(`Added to Without DCP: ${classification}`);
            }
        });

        const result = Object.entries(classificationCounts).map(
            ([name, counts]) => ({
                name,
                withDCP: counts.withDCP,
                withoutDCP: counts.withoutDCP,
            })
        );

        console.log("Classified Schools Data:", result);
        return result;
    };

    // ✅ Run the function
    const schoolData = classifySchools(schools, schoolBatches);

    // ✅ Compute totals
    const totalWithDCP = schoolData.reduce(
        (sum, item) => sum + item.withDCP,
        0
    );
    const totalWithoutDCP = schoolData.reduce(
        (sum, item) => sum + item.withoutDCP,
        0
    );

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [batchData, schoolData, schoolBatchList] =
                    await Promise.all([
                        getAllBatches(),
                        getAllSchools(),
                        getAllSchoolBatchLists(),
                    ]);

                setBatches(
                    batchData.map((batch: any) => ({
                        ...batch,
                        schoolBatchList: batch.schoolBatchList || [],
                        configurations: batch.configurations || [],
                    }))
                );
                setSchools(schoolData);
                setSchoolBatches(schoolBatchList);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const getClassificationCounts = () => {
        const counts: Record<string, number> = {};

        classificationOptions.forEach((classification) => {
            counts[classification] = schools.filter(
                (school) => school.classification === classification
            ).length;
        });

        return counts;
    };

    const classificationCounts = getClassificationCounts();
    const totalSchools = schools.length;

    const getMajorityClassification = (
        batchId: number,
        schoolBatches: SchoolBatchList[]
    ) => {
        const classificationCount: Record<string, number> = {};

        // Filter schools that belong to the batch
        schoolBatches
            .filter((schoolBatch) => schoolBatch.batch?.batchId === batchId)
            .forEach((schoolBatch) => {
                const classification =
                    schoolBatch.school.classification || "Unknown";
                classificationCount[classification] =
                    (classificationCount[classification] || 0) + 1;
            });

        // Find the classification with the highest count
        return Object.entries(classificationCount).reduce(
            (max, entry) => (entry[1] > max[1] ? entry : max),
            ["Unknown", 0] // Default if no classification found
        )[0];
    };

    const data = [
        {
            label: "DCP Package",
            value: "dcp-package",
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
                            Total Number of DCP Packages:{" "}
                            {batches.reduce(
                                (total, batch) =>
                                    total + Number(batch.numberOfPackage),
                                0
                            )}
                        </h2>

                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Batch
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Majority Classification
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Package
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches
                                        .sort((a, b) => b.batchId - a.batchId)
                                        .map((batch) => (
                                            <tr
                                                key={batch.batchId}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {batch.batchName}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {getMajorityClassification(
                                                        batch.batchId,
                                                        schoolBatches
                                                    )}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {batch.numberOfPackage}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Schools",
            value: "schools",
            icon: UserCircleIcon,
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
                            Total Number of Schools: {totalSchools}
                        </h2>

                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Classification
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Count
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classificationOptions.map(
                                        (classification) => (
                                            <tr
                                                key={classification}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {classification}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {classificationCounts[
                                                        classification
                                                    ] || 0}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "DCP Program",
            value: "dcp-program",
            icon: Cog6ToothIcon,
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
                            DCP Program
                        </h2>

                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Classification
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            With DCP
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Without DCP
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schoolData.map((program) => (
                                        <tr
                                            key={program.name}
                                            className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                        >
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {program.name}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {program.withDCP}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {program.withoutDCP}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-200 font-semibold">
                                        <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Total
                                        </td>
                                        <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            {totalWithDCP}
                                        </td>
                                        <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            {totalWithoutDCP}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            ),
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* ✅ Fix: Use Controlled Tabs with `value` and `onChange` */}
            <Tabs
                value={activeTab}
                onChange={(val: string) => setActiveTab(val)}
            >
                <TabsHeader
                    className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-xlg mx-auto rounded-xl flex justify-center"
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

                {/* ✅ Fix: Ensure `TabPanel` Uses Matching `value` Keys */}
                <TabsBody
                    className="p-4"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {data.map(({ value, content }) => (
                        <TabPanel key={value} value={value}>
                            {/* ✅ Show `content` if available, otherwise show `desc` */}
                            {content}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>

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

export default Dashboard;
