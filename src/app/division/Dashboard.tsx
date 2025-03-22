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
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {batch.batchName}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {/* Add classification here if needed */}
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
                                    {[
                                        {
                                            name: "Elementary",
                                            withDCP: 776,
                                            withoutDCP: 48,
                                        },
                                        {
                                            name: "Secondary (JHS & SHS)",
                                            withDCP: 189,
                                            withoutDCP: 20,
                                        },
                                        {
                                            name: "JHS",
                                            withDCP: 5,
                                            withoutDCP: 6,
                                        },
                                        {
                                            name: "Integrated School",
                                            withDCP: 77,
                                            withoutDCP: 3,
                                        },
                                    ].map((program) => (
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
                                            1047
                                        </td>
                                        <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            77
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
        </div>
    );
};

export default Dashboard;
