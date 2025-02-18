import React, { useState } from "react";
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

const Dashboard = () => {
    // ✅ Fix: Use State to Track Active Tab
    const [activeTab, setActiveTab] = useState("dcp-package");

    const data = [
        {
            label: "DCP Package",
            value: "dcp-package", // ✅ Match this value with TabsHeader & TabsBody
            icon: Square3Stack3DIcon,
            content: (
                <>
                    <div className="p-6">
                        <Typography
                            variant="lead"
                            color="blue-gray"
                            className="font-bold"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Total Number of DCP Package: 2898
                        </Typography>
                        {/* ✅ Table Fix */}
                        <div className="w-full overflow-x-auto mt-4">
                            <table className="w-full text-left border border-collapse rounded border-slate-200">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Batch
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Education Level
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            DCP Package
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="transition-colors duration-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                            Ayub Salas
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                            Designer
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200 text-slate-500">
                                            Carroll Group
                                        </td>
                                    </tr>
                                    <tr className="transition-colors duration-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                                            Agnes Sherman
                                        </td>
                                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                                            Developer
                                        </td>
                                        <td className="h-12 px-6 text-sm transition duration-300 border-t border-l first:border-l-0 border-slate-200 stroke-slate-500 text-slate-500">
                                            Apple
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ),
        },
        {
            label: "Schools",
            value: "schools",
            icon: UserCircleIcon,
            content: (
                <>
                    <div className="p-6">
                        <Typography
                            variant="lead"
                            color="blue-gray"
                            className="font-bold"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                        >
                            Total Number of Schools: 1124
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
                                    <tr className="border border-slate-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            Elementary
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            824
                                        </td>
                                    </tr>
                                    <tr className="transition-colors duration-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            Secondary (JHS & SHS)
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            209
                                        </td>
                                    </tr>
                                    <tr className="transition-colors duration-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            JHS
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            11
                                        </td>
                                    </tr>
                                    <tr className="transition-colors duration-300 hover:bg-emerald-100">
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            Integrated School
                                        </td>
                                        <td className="h-12 px-6 text-sm border-t border-l first:border-l-0 border-slate-200">
                                            80
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
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
