import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
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

interface Batch {
    batchId: number;
    batchName: string;
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
    remarks: string;
    schoolBatchList: SchoolBatchList[];
    configurations: Configuration[];
}

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

interface Package {
    packageId: number;
    item: string;
    status?: string;
    component?: string;
    serialNumber?: string;
    assigned?: string;
    remarks?: string;
    schoolBatchList: SchoolBatchList;
    configuration: Configuration;
}

interface Configuration {
    configurationId: number;
    batch: Batch;
    item: string;
    type?: string;
    quantity?: number;
}

const classificationOptions = [
    "Primary (K-3)",
    "Elementary",
    "Secondary (JHS/SHS)",
    "JHS",
    "SHS",
    "Integrated School",
];

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dcp-package");

    const [batches, setBatches] = useState<Batch[]>([]);
    const [schools, setSchools] = useState<School[]>([]);

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getAllBatches();
            console.log(data);
            setBatches(
                data.map((batch: any) => ({
                    ...batch,
                    schoolBatchList: batch.schoolBatchList || [],
                    configurations: batch.configurations || [],
                }))
            );
        } catch (error) {
            console.error("Failed to fetch batches:", error);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const data = await getAllSchools();
            console.log(data);
            setSchools(data);
        } catch (error) {
            console.error("Error fetching schools:", error);
        }
    };

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

    const data = [
        {
            label: "DCP Package",
            value: "dcp-package",
            icon: Square3Stack3DIcon,
            content: (
                <div className="p-6">
                    <Typography
                        variant="lead"
                        color="blue-gray"
                        className="font-bold"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        Total Number of DCP Package:{" "}
                        {batches.reduce(
                            (total, batch) =>
                                total + Number(batch.numberOfPackage),
                            0
                        )}
                    </Typography>

                    <div className="w-full overflow-x-auto mt-4">
                        <table className="w-full text-left border border-collapse rounded border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                        Batch
                                    </th>
                                    <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                        Classification
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
                                            className="transition-colors duration-300 hover:bg-emerald-100"
                                        >
                                            <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                                {batch.batchName}
                                            </td>
                                            <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                                {/* Leave Classification blank */}
                                            </td>
                                            <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                                {batch.numberOfPackage}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
        },
        {
            label: "Schools",
            value: "schools",
            icon: UserCircleIcon,
            content: (
                <div className="p-6">
                    <Typography
                        variant="lead"
                        color="blue-gray"
                        className="font-bold"
                        placeholder=""
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                    >
                        Total Number of Schools: {totalSchools}
                    </Typography>
                    <div className="w-full overflow-x-auto mt-4">
                        <table className="w-full text-left border border-collapse rounded border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
                                    <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                        Classification
                                    </th>
                                    <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                        Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {classificationOptions.map((classification) => (
                                    <tr
                                        key={classification}
                                        className="border border-slate-300 hover:bg-emerald-100"
                                    >
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            {classification}
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            {classificationCounts[
                                                classification
                                            ] || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ),
        },
        {
            label: "DCP Program",
            value: "dcp-program",
            icon: Cog6ToothIcon,
            content: (
                <div className="p-6">
                    <Typography
                        variant="lead"
                        color="blue-gray"
                        className="font-bold"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                    >
                        DCP Program
                    </Typography>
                    <div className="w-full overflow-x-auto mt-4">
                        <table className="w-full text-left border border-collapse rounded border-slate-200">
                            <thead>
                                <tr className="bg-slate-100">
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
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        Elementary
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        776
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        48
                                    </td>
                                </tr>
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        Secondary (JHS & SHS)
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        189
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        20
                                    </td>
                                </tr>
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        JHS
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        5
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        6
                                    </td>
                                </tr>
                                <tr className="border border-slate-300 hover:bg-emerald-100">
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        Integrated School
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        77
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        3
                                    </td>
                                </tr>
                                {/* Total Row */}
                                <tr className="bg-gray-200 font-semibold">
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        Total
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        1047
                                    </td>
                                    <td className="h-12 px-6 text-sm border border-slate-300">
                                        77
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
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
        </div>
    );
};

export default Dashboard;
