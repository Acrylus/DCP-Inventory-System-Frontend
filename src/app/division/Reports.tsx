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
import { Box, Button, CircularProgress } from "@mui/material";
import * as XLSX from "xlsx";
import { Card, CardBody } from "@material-tailwind/react";
import { getAllSchoolContacts } from "../../lib/schoolcontact-api/getAllSchoolContact";
import { getAllSchoolEnergy } from "../../lib/schoolenergy-api/getAllSchoolEnergy";
import { getAllSchoolNTC } from "../../lib/schoolntc-api/getAllSchoolNTC";
import { getAllPackage } from "../../lib/package-api/getAllPackage";

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

interface SchoolBatchList {
    schoolBatchId: number;
    school: School;
    batch: Batch;
    deliveryDate: Date;
    numberOfPackage: number;
    status: string;
    keyStage: string;
    remarks: string;
    accountable: string;
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

const Reports = () => {
    const [activeTab, setActiveTab] = useState("inventory");
    const [schoolContacts, setSchoolContacts] = useState<SchoolContact[]>([]);
    const [schoolEnergies, setSchoolEnergies] = useState<SchoolEnergy[]>([]);
    const [schoolNTCs, setSchoolNTCs] = useState<SchoolNTC[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchoolContacts = async () => {
            try {
                const contacts = await getAllSchoolContacts();
                setSchoolContacts(contacts);
            } catch (err) {
                console.error("Error fetching school contacts:", err);
                setError("Failed to fetch school contacts");
            }
        };

        const fetchSchoolEnergies = async () => {
            try {
                const energies = await getAllSchoolEnergy();
                setSchoolEnergies(energies);
            } catch (err) {
                console.error("Error fetching school energies:", err);
                setError("Failed to fetch school energies");
            }
        };

        const fetchSchoolNTCs = async () => {
            try {
                const ntcs = await getAllSchoolNTC();
                setSchoolNTCs(ntcs);
            } catch (err) {
                console.error("Error fetching school NTCs:", err);
                setError("Failed to fetch school NTCs");
            }
        };

        const fetchData = async () => {
            setLoading(true); // Set loading to true when starting all fetches

            // Wait for all fetches to complete
            await Promise.all([
                fetchSchoolContacts(),
                fetchSchoolEnergies(),
                fetchSchoolNTCs(),
            ]);

            setLoading(false); // Set loading to false after all fetches are done
        };

        fetchData(); // Call fetchData function
    }, []);

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true); // Set loading to true before starting the fetch

            try {
                const data = await getAllPackage();
                if (!Array.isArray(data))
                    throw new Error("Invalid data format");
                setPackages(data);
            } catch (err) {
                console.error("Error fetching packages:", err);
                setError("Failed to fetch packages");
                setPackages([]); // Set empty array in case of error
            } finally {
                setLoading(false); // Set loading to false after the fetch completes
            }
        };

        fetchPackages();
    }, []);

    const filteredData = packages.filter((pkg) =>
        [
            pkg.schoolBatchList?.school?.district.division?.division,
            pkg.schoolBatchList?.school?.district?.name,
            pkg.schoolBatchList?.school?.name,
            pkg.configuration.item,
            pkg.serialNumber,
        ]
            .filter(Boolean) // Remove undefined values
            .some((field) =>
                field
                    ?.toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
    );

    const filteredSchoolContacts = schoolContacts.filter((contact) =>
        [
            contact.school?.schoolId,
            contact.school?.name,
            contact.landline,
            contact.schoolHead,
            contact.schoolHeadNumber,
            contact.schoolHeadEmail,
            contact.designation,
            contact.propertyCustodian,
            contact.propertyCustodianNumber,
            contact.propertyCustodianEmail,
        ]
            .filter(Boolean)
            .some((field) =>
                field
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
    );

    const filteredSchoolEnergies = schoolEnergies.filter((energy) =>
        [
            energy.school?.schoolId,
            energy.school?.name,
            energy.energized ? "Yes" : "No",
            energy.remarks,
            energy.localGridSupply ? "Available" : "Not Available",
            energy.type,
        ]
            .filter(Boolean)
            .some((field) =>
                field
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
    );

    const filteredSchoolNTCs = schoolNTCs.filter((ntc) =>
        [
            ntc.school?.schoolId,
            ntc.school?.name,
            ntc.internet ? "Yes" : "No",
            ntc.pldt ? "Yes" : "No",
            ntc.globe ? "Yes" : "No",
            ntc.am ? "Yes" : "No",
            ntc.fm ? "Yes" : "No",
            ntc.tv ? "Yes" : "No",
            ntc.cable ? "Yes" : "No",
            ntc.remark,
        ]
            .filter(Boolean)
            .some((field) =>
                field
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
    );

    // Export Inventory Report
    const exportInventoryToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filteredData.map((pkg) => ({
                Division:
                    pkg.schoolBatchList?.school?.district.division?.division ||
                    "",
                District: pkg.schoolBatchList?.school?.district?.name || "",
                School: pkg.schoolBatchList?.school?.name || "",
                Batch_No: pkg.schoolBatchList?.schoolBatchId || "",
                Delivery_Date: pkg.schoolBatchList?.deliveryDate || "N/A",
                Item: pkg.configuration?.item || "",
                Serial_Number: pkg.serialNumber || "",
                Status: pkg.status || "",
                Component: pkg.component || "",
                Assigned: pkg.assigned || "",
                Remarks: pkg.remarks || "",
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventory Report");

        XLSX.writeFile(wb, "Inventory_Report.xlsx");
    };

    // Export School Contacts
    const exportSchoolContactsToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredSchoolContacts.map((contact) => ({
                "School ID": contact.school.schoolId,
                "School Name": contact.school.name,
                Landline: contact.landline,
                "School Head": contact.schoolHead,
                "Head Number": contact.schoolHeadNumber,
                "Head Email": contact.schoolHeadEmail,
                Designation: contact.designation,
                "Property Custodian": contact.propertyCustodian,
                "Custodian Number": contact.propertyCustodianNumber,
                "Custodian Email": contact.propertyCustodianEmail,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Schools List");
        XLSX.writeFile(workbook, "Schools_List.xlsx");
    };

    // Export Energized Schools Report
    const exportEnergizedSchoolsToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            filteredSchoolEnergies.map((energy) => ({
                "School ID": energy.school.schoolId,
                "School Name": energy.school.name,
                Energized: energy.energized ? "Yes" : "No",
                Remarks: energy.remarks,
                "Local Grid Supply": energy.localGridSupply
                    ? "Available"
                    : "Not Available",
                Type: energy.type,
            }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Energized Schools");
        XLSX.writeFile(workbook, "Energized_Schools.xlsx");
    };

    // Export NTC Report
    const exportNTCReportToExcel = () => {
        // Define the table headers
        const headers = [
            "School ID",
            "School Name",
            "Internet",
            "PLDT",
            "Globe",
            "AM",
            "FM",
            "TV",
            "Cable",
            "Remarks",
        ];

        // Map data to match the headers
        const data = filteredSchoolNTCs.map((ntc) => [
            ntc.school.schoolId,
            ntc.school.name,
            ntc.internet ? "Yes" : "No",
            ntc.pldt ? "Yes" : "No",
            ntc.globe ? "Yes" : "No",
            ntc.am ? "Yes" : "No",
            ntc.fm ? "Yes" : "No",
            ntc.tv ? "Yes" : "No",
            ntc.cable ? "Yes" : "No",
            ntc.remark,
        ]);

        // Combine headers and data
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "NTC Report");

        // Export the Excel file
        XLSX.writeFile(workbook, "NTC_Report.xlsx");
    };

    const reportTabs = [
        {
            label: "Inventory",
            value: "inventory",
            icon: DocumentTextIcon,
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
                            📦 Inventory Management
                        </Typography>
                        <p className="text-gray-700 mt-2">
                            This report provides an overview of inventory items,
                            including their status, batch, and assignment
                            details.
                        </p>

                        {/* Search Bar */}
                        <div className="relative my-6 text-black">
                            <input
                                type="search"
                                placeholder="Search inventory..."
                                className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none focus:border-emerald-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={exportInventoryToExcel}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Export Inventory
                        </Button>

                        {/* Loading and Error States */}
                        {loading && <p className="text-center">Loading...</p>}
                        {error && (
                            <p className="text-center text-red-500">{error}</p>
                        )}

                        {/* Scrollable Table */}
                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead className="bg-slate-100 text-gray-700">
                                    <tr>
                                        {[
                                            "Division",
                                            "District",
                                            "School",
                                            "Batch No",
                                            "Delivery Date",
                                            "Item",
                                            "Serial Number",
                                            "Status",
                                            "Component",
                                            "Assigned",
                                            "Remarks",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((pkg, index) => (
                                            <tr
                                                key={index}
                                                className={`h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100 ${
                                                    index % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }`}
                                            >
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        pkg.schoolBatchList
                                                            .school.district
                                                            .division.division
                                                    }
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        pkg.schoolBatchList
                                                            .school.district
                                                            .name
                                                    }
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        pkg.schoolBatchList
                                                            .school.name
                                                    }
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {
                                                        pkg.schoolBatchList
                                                            .batch.batchName
                                                    }
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.schoolBatchList
                                                        .deliveryDate
                                                        ? new Date(
                                                              pkg.schoolBatchList.deliveryDate
                                                          ).toLocaleDateString(
                                                              "en-CA"
                                                          ) // Formats to 'YYYY-MM-DD'
                                                        : "N/A"}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.configuration.item}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.serialNumber}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.status}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.component}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.assigned}
                                                </td>
                                                <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                    {pkg.remarks}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={11}
                                                className="text-center py-4 text-gray-500"
                                            >
                                                No results found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
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

                        {/* Search Bar */}
                        <div className="relative my-6 text-black">
                            <input
                                type="search"
                                placeholder="Search inventory..."
                                className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none focus:border-emerald-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={exportSchoolContactsToExcel}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Export School Contacts
                        </Button>

                        {/* Loading and Error States */}
                        {loading && <p className="text-center">Loading...</p>}
                        {error && (
                            <p className="text-center text-red-500">{error}</p>
                        )}

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
                                                colSpan={10}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSchoolContacts.map(
                                            (contact) => (
                                                <tr
                                                    key={
                                                        contact.schoolContactId
                                                    }
                                                    className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                                >
                                                    <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                        {
                                                            contact.school
                                                                .schoolId
                                                        }
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
                                                        {
                                                            contact.schoolHeadNumber
                                                        }
                                                    </td>
                                                    <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                        {
                                                            contact.schoolHeadEmail
                                                        }
                                                    </td>
                                                    <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                        {contact.designation}
                                                    </td>
                                                    <td className="h-12 px-6 text-sm font-medium border border-slate-300">
                                                        {
                                                            contact.propertyCustodian
                                                        }
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
                                            )
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

                        {/* Search Bar */}
                        <div className="relative my-6 text-black">
                            <input
                                type="search"
                                placeholder="Search inventory..."
                                className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none focus:border-emerald-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={exportEnergizedSchoolsToExcel}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Export Energized Schools
                        </Button>

                        {/* Loading and Error States */}
                        {loading && <p className="text-center">Loading...</p>}
                        {error && (
                            <p className="text-center text-red-500">{error}</p>
                        )}

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
                                                colSpan={6}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSchoolEnergies.map((energy) => (
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
                        className="p-6 h-full w-full"
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

                            {/* Search Bar */}
                            <div className="relative my-6 text-black">
                                <input
                                    type="search"
                                    placeholder="Search inventory..."
                                    className="w-full h-10 px-4 border border-gray-300 rounded-md outline-none focus:border-emerald-500"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>

                            <Button
                                onClick={exportNTCReportToExcel}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Export NTC Report
                            </Button>

                            {/* Loading and Error States */}
                            {loading && (
                                <p className="text-center">Loading...</p>
                            )}
                            {error && (
                                <p className="text-center text-red-500">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="w-full max-h-96 overflow-y-auto">
                            <table className="w-full text-left border border-separate border-slate-200 rounded-md">
                                <thead>
                                    <tr className="bg-slate-100 text-gray-700">
                                        {[
                                            "School ID",
                                            "School Name",
                                            "Internet",
                                            "PLDT",
                                            "Globe",
                                            "AM",
                                            "FM",
                                            "TV",
                                            "Cable",
                                            "Remarks",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="text-center py-4"
                                            >
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSchoolNTCs.map((ntc) => (
                                            <tr
                                                key={ntc.schoolNTCId}
                                                className="h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
                                            >
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.school.schoolId}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.school.name}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.internet
                                                        ? "Yes"
                                                        : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.pldt ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.globe ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.am ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.fm ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.tv ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.cable ? "Yes" : "No"}
                                                </td>
                                                <td className="px-6 border border-slate-300">
                                                    {ntc.remark}
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
                            className="flex justify-center items-center w-full h-[70vh]"
                        >
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

export default Reports;
