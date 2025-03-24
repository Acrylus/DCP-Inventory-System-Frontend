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
import { Card, CardBody } from "@material-tailwind/react";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
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
            setLoading(false);
        };
        fetchData();
    }, []);

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
                        <Typography
                            variant="lead"
                            color="blue-gray"
                            className="font-bold"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            🏫 Masterlist of Schools - Contact List
                        </Typography>
                        <p className="text-gray-700 mt-2">
                            This report contains the contact details of all
                            schools.
                        </p>
                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead className="bg-slate-100 text-gray-700">
                                    <tr>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School ID
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School Name
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Landline
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School Head
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Head Number
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Head Email
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Designation
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Property Custodian
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Custodian Number
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Custodian Email
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        schoolContacts.map((contact) => (
                                            <tr
                                                key={contact.schoolContactId}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.school.schoolId}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.school.name}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.landline}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.schoolHead}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.schoolHeadNumber}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.schoolHeadEmail}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.designation}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {contact.propertyCustodian}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        contact.propertyCustodianNumber
                                                    }
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        contact.propertyCustodianEmail
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "Energized Schools",
            value: "energized-schools",
            icon: ClipboardDocumentIcon,
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
                        <Typography
                            variant="lead"
                            color="blue-gray"
                            className="font-bold"
                            placeholder=""
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                        >
                            ⚡ Masterlist of Energized & Unenergized Schools
                        </Typography>
                        <p className="text-gray-700 mt-2">
                            This report tracks power availability in schools.
                        </p>
                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead className="bg-slate-100 text-gray-700">
                                    <tr>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School ID
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School Name
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Energized
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Remarks
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Local Grid Supply
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Type
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        schoolEnergies.map((energy) => (
                                            <tr
                                                key={energy.schoolEnergyId}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.school.schoolId}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.school.name}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.energized
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.remarks}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.localGridSupply
                                                        ? "Available"
                                                        : "Not Available"}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {energy.type}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            ),
        },
        {
            label: "NTC Report",
            value: "ntc",
            icon: PrinterIcon,
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
                        <div className="p-6">
                            <Typography
                                variant="lead"
                                color="blue-gray"
                                className="font-bold"
                                placeholder=""
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            >
                                📜 NTC Report
                            </Typography>
                            <p className="text-gray-700 mt-2">
                                This report details telecommunications
                                compliance of schools.
                            </p>
                        </div>

                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School ID
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            School Name
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Internet
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            PLDT
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Globe
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            AM
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            FM
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            TV
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Cable
                                        </th>
                                        <th className="h-12 px-6 text-sm font-medium border border-slate-300">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schoolNTCs.map((ntc) => (
                                        <tr
                                            key={ntc.schoolNTCId}
                                            className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                        >
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.school.schoolId}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.school.name}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.internet ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.pldt ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.globe ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.am ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.fm ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.tv ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.cable ? "Yes" : "No"}
                                            </td>
                                            <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                {ntc.remark}
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
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-6">
            <Tabs
                value={activeTab}
                onChange={(val: string) => setActiveTab(val)}
            >
                {/* ✅ Matching TabsHeader with Dashboard Style */}
                <TabsHeader
                    className="sticky top-0 z-10 bg-gray-100 shadow-md p-1 max-w-xlg mx-auto rounded-xl flex justify-center"
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
