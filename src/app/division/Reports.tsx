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
import { Card, CardBody } from "@material-tailwind/react";
import { getAllSchoolContacts } from "../../lib/schoolcontact-api/getAllSchoolContact";
import { getAllSchoolEnergy } from "../../lib/schoolenergy-api/getAllSchoolEnergy";
import { getAllSchoolNTC } from "../../lib/schoolntc-api/getAllSchoolNTC";
import { getAllPackage } from "../../lib/package-api/getAllPackage";
import { getCoordinatorBySchoolId } from "../../lib/coordinator-api/getCoordinatorBySchoolId";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { headerImg } from "../../assets/base64/headerBase64";
import { footerImg } from "../../assets/base64/footerBase64";
import * as XLSX from "xlsx";
import { getAllCoordinators } from "../../lib/coordinator-api/getAllCoordinator";

const pageMargins = { top: 30, bottom: 20 };
const styles = { fontSize: 8, cellPadding: 2 };

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
    coordinators: Coordinator[];
}

interface Coordinator {
    coordinatorId: number;
    name: string;
    designation: string;
    email: string;
    number: string;
    remarks: string;
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
    deliveryDate: string;
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
    budgetYear: number;
    deliveryYear: number;
    price: number;
    supplier: string;
    numberOfPackage: number;
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState<SchoolContact | null>(
        null
    );

    const addHeaderFooter = (doc: any) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerHeight = 20;

        // Calculate the horizontal center position
        const headerX = (pageWidth - (pageWidth - 100)) / 2;
        const footerX = (pageWidth - (pageWidth - 100)) / 2;

        // Add the header image centered
        doc.addImage(headerImg, "PNG", headerX, 5, pageWidth - 100, 25);

        // Add the footer image centered
        doc.addImage(
            footerImg,
            "PNG",
            footerX,
            pageHeight - footerHeight - 5,
            pageWidth - 100,
            footerHeight
        );
    };

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
            contact.coordinators,
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

    const exportInventoryReport = () => {
        const headers = [
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
        ];

        const body = filteredData.map((pkg: any) => [
            pkg.schoolBatchList?.school?.district.division?.division || "",
            pkg.schoolBatchList?.school?.district?.name || "",
            pkg.schoolBatchList?.school?.name || "",
            pkg.schoolBatchList?.schoolBatchId || "",
            pkg.schoolBatchList?.deliveryDate || "N/A",
            pkg.configuration?.item || "",
            pkg.serialNumber || "",
            pkg.status || "",
            pkg.component || "",
            pkg.assigned || "",
            pkg.remarks || "",
        ]);

        // Save as PDF
        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
            startY: pageMargins.top,
            head: [headers],
            body,
            margin: pageMargins,
            styles,
            didDrawPage: () => addHeaderFooter(doc),
        });
        doc.save("Inventory_Report.pdf");

        // Save as Excel
        exportToExcel(body, headers, "Inventory_Report");
    };

    const exportSchoolContactsReport = () => {
        const headers = [
            "School ID",
            "School Name",
            "Landline",
            "School Head",
            "Head Number",
            "Head Email",
            "Designation",
            "Custodian",
            "Custodian Number",
            "Custodian Email",
        ];

        const body = filteredSchoolContacts.map((contact: any) => [
            contact.school.schoolId,
            contact.school.name,
            contact.landline,
            contact.schoolHead,
            contact.schoolHeadNumber,
            contact.schoolHeadEmail,
            contact.designation,
            contact.propertyCustodian,
            contact.propertyCustodianNumber,
            contact.propertyCustodianEmail,
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
            startY: pageMargins.top,
            head: [headers],
            body,
            margin: pageMargins,
            styles,
            didDrawPage: () => addHeaderFooter(doc),
        });
        doc.save("Schools_List.pdf");

        exportToExcel(body, headers, "Schools_List");
    };

    const exportEnergizedSchoolsReport = () => {
        const headers = [
            "School ID",
            "School Name",
            "Energized",
            "Remarks",
            "Local Grid Supply",
            "Type",
        ];

        const body = filteredSchoolEnergies.map((energy: any) => [
            energy.school.schoolId,
            energy.school.name,
            energy.energized ? "Yes" : "No",
            energy.remarks,
            energy.localGridSupply ? "Available" : "Not Available",
            energy.type,
        ]);

        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
            startY: pageMargins.top,
            head: [headers],
            body,
            margin: pageMargins,
            styles,
            didDrawPage: () => addHeaderFooter(doc),
        });
        doc.save("Energized_Schools.pdf");

        exportToExcel(body, headers, "Energized_Schools");
    };

    const exportNTCReport = () => {
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

        const body = filteredSchoolNTCs.map((ntc: any) => [
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

        const doc = new jsPDF({ orientation: "landscape" });
        autoTable(doc, {
            startY: pageMargins.top,
            head: [headers],
            body,
            margin: pageMargins,
            styles,
            didDrawPage: () => addHeaderFooter(doc),
        });
        doc.save("NTC_Report.pdf");

        exportToExcel(body, headers, "NTC_Report");
    };

    const exportCoordinators = async () => {
        try {
            const response = await getAllCoordinators();
            const coordinators = response;

            const headers = [
                "Name",
                "Designation",
                "Email",
                "Number",
                "Remarks",
            ];
            const body = coordinators.map((coord: any) => [
                coord.name,
                coord.designation,
                coord.email,
                coord.number,
                coord.remarks,
            ]);

            // PDF Export
            const doc = new jsPDF({ orientation: "landscape" });
            autoTable(doc, {
                startY: pageMargins.top,
                head: [headers],
                body: body,
                margin: { top: 10, left: 10, right: 10, bottom: 10 },
                didDrawPage: () => addHeaderFooter(doc),
            });
            doc.save("Coordinators_Report.pdf");

            // Excel Export
            const worksheetData = [headers, ...body];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Coordinators");
            XLSX.writeFile(workbook, "Coordinators_Report.xlsx");
        } catch (error) {
            console.error("Failed to export coordinators", error);
        }
    };

    const exportToExcel = (
        data: any[],
        headers: string[],
        filename: string
    ) => {
        const worksheetData = [headers, ...data];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const fetchCoordinators = async (schoolRecordId: number) => {
        setLoading(true); // Set loading to true when fetching data
        try {
            const coordinators = await getCoordinatorBySchoolId(schoolRecordId);
            // Ensure that coordinators have a 'coordinatorId' field
            const updatedCoordinators = coordinators.map(
                (coordinator, index) => ({
                    ...coordinator,
                    coordinatorId: coordinator.coordinatorId || index + 1, // or some unique id logic
                })
            );

            return updatedCoordinators;
        } catch (error) {
            console.error("Failed to fetch coordinators:", error);
            return []; // Return an empty array if the request fails
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    const handleRowClick = async (contact: SchoolContact) => {
        setSelectedSchool(contact); // Set selected school
        console.log(contact);

        setIsModalOpen(true); // Open the modal

        const coordinators = await fetchCoordinators(
            contact.school.schoolRecordId
        );

        // Update the school contact with fetched coordinators
        const updatedContact = {
            ...contact,
            coordinators: coordinators,
        };

        setSelectedSchool(updatedContact); // Update selected school with coordinators
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
                            onClick={exportInventoryReport}
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
                            onClick={exportSchoolContactsReport}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Export School Contacts
                        </Button>

                        <Button
                            onClick={exportCoordinators}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Export Coordinators
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
                                                    onClick={async () => {
                                                        await handleRowClick(
                                                            contact
                                                        );
                                                    }}
                                                    className="cursor-pointer h-12 px-6 text-sm font-medium border border-slate-300 hover:bg-emerald-100"
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
                            onClick={exportEnergizedSchoolsReport}
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
                                onClick={exportNTCReport}
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

            {isModalOpen && selectedSchool && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Coordinators of {selectedSchool.school?.name}
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Email
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Phone
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Role
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                            Remark
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedSchool.coordinators?.map(
                                        (coordinator, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {coordinator.name}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {coordinator.email}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {coordinator.number}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {coordinator.designation}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap">
                                                    {coordinator.remarks}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
