import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import {
    DocumentTextIcon,
    ClipboardIcon,
    ClipboardDocumentIcon,
    PrinterIcon,
} from "@heroicons/react/24/solid";
import { getAllSchoolContacts } from "../../lib/schoolcontact-api/getAllSchoolContact";
import { getAllSchoolEnergy } from "../../lib/schoolenergy-api/getAllSchoolEnergy";
import { getAllSchoolNTC } from "../../lib/schoolntc-api/getAllSchoolNTC";

interface School {
    schoolRecordId: number;
    district: District;
    classification: string;
    schoolId: string;
    name: string;
    address: string;
    previousStation: string;
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
    division: Division;
    name: string;
}

interface SchoolContact {
    schoolContactId: number;
    school: School;
    landline: string;
    schoolHead: string;
    schoolHeadNumber: string;
    schoolHeadEmail: string;
    designation: string;
    propertyCustodian: string;
    propertyCustodianNumber: string;
    propertyCustodianEmail: string;
}
interface SchoolEnergy {
    schoolEnergyId: number;
    school: School;
    energized: boolean;
    remarks: string;
    localGridSupply: boolean;
    type: string;
}

interface SchoolNTC {
    schoolNTCId: number;
    school: School;
    internet: boolean;
    pldt: boolean;
    globe: boolean;
    am: boolean;
    fm: boolean;
    tv: boolean;
    cable: boolean;
    remark: string;
    providers: Provider[];
}

interface Provider {
    providerId: number;
    name: string;
    speed: number;
    unit: string;
}

const Reports = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const [schoolContacts, setSchoolContacts] = useState<SchoolContact[]>([]);
    const [schoolEnergies, setSchoolEnergies] = useState<SchoolEnergy[]>([]);
    const [schoolNTCs, setSchoolNTCs] = useState<SchoolNTC[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log("test");
            try {
                const contacts = await getAllSchoolContacts();
                setSchoolContacts(contacts);
                const energies = await getAllSchoolEnergy();
                setSchoolEnergies(energies);
                const ntcs = await getAllSchoolNTC();
                setSchoolNTCs(ntcs);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const renderTable = (data: any[], columns: string[]) => (
        <div className="w-full max-h-96 overflow-y-auto">
            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                <thead className="h-12 px-6 text-sm font-medium border border-slate-300">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                className="bg-slate-100 text-gray-700"
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col}
                                    className="h-12 px-6 text-sm font-medium border border-slate-300"
                                >
                                    {item[col]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const reportTabs = [
        {
            label: "Inventory",
            value: "inventory",
            icon: DocumentTextIcon,
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
                        📊 Inventory Report
                    </Typography>
                    <p className="text-gray-700 mt-2">
                        This report provides a comprehensive list of all
                        inventory items.
                    </p>
                </div>
            ),
        },
        {
            label: "Schools List",
            value: "contact-list",
            icon: ClipboardIcon,
            content: renderTable(schoolContacts, [
                "schoolHead",
                "schoolHeadNumber",
                "schoolHeadEmail",
                "designation",
                "propertyCustodian",
                "propertyCustodianNumber",
                "propertyCustodianEmail",
            ]),
        },
        {
            label: "Energized Schools",
            value: "energized-schools",
            icon: ClipboardDocumentIcon,
            content: renderTable(schoolEnergies, [
                "energized",
                "remarks",
                "localGridSupply",
                "type",
            ]),
        },
        {
            label: "NTC Report",
            value: "ntc",
            icon: PrinterIcon,
            content: renderTable(schoolNTCs, [
                "internet",
                "pldt",
                "globe",
                "am",
                "fm",
                "tv",
                "cable",
                "provider",
                "speed",
                "remark",
            ]),
        },
    ];

    return (
        <div className="w-full mx-auto p-4">
            <Tabs
                value={activeTab}
                onChange={(val: string) => setActiveTab(val)}
            >
                {/* ✅ Matching TabsHeader with Dashboard Style */}
                <TabsHeader
                    className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-xlg mx-auto rounded-xl flex justify-center max-w-6xl"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {reportTabs.map(({ label, value, icon }) => (
                        <Tab
                            key={value}
                            value={value}
                            onClick={() => setActiveTab(value)}
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

                {/* ✅ Matching TabPanel Design */}
                <TabsBody
                    className="p-6 bg-gray-50 rounded-xl mt-6"
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                >
                    {reportTabs.map(({ value, content }) => (
                        <TabPanel
                            key={value}
                            value={value}
                            className="flex justify-center items-center w-full"
                        >
                            {content}
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );
};

export default Reports;
