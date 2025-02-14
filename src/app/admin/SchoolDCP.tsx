import { useState } from "react";
//Zai Gwapa
const SchoolDCP = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [divisionFilter, setDivisionFilter] = useState("All");
    const [municipalityFilter, setMunicipalityFilter] = useState("All");
    const [classificationFilter, setClassificationFilter] = useState("All");

    // Sample Data (Replace with API Data)
    const schoolList = [
        {
            schoolID: "119311",
            schoolName: "ABLAYAN ELEMENTARY SCHOOL",
            division: "Cebu Province",
            municipality: "Dalaguete",
            classification: "Elementary",
        },
        {
            schoolID: "119703",
            schoolName: "ABUGON ELEMENTARY SCHOOL",
            division: "Cebu Province",
            municipality: "Sibonga",
            classification: "Elementary",
        },
    ];

    const dcpDetails = [
        {
            batchNo: "DCP FY2025",
            deliveryDate: "2025-02-01",
            numOfPkg: 1,
            keyStage: "",
            remarks: "",
            schoolID: "119311",
        },
        {
            batchNo: "Batch 19",
            deliveryDate: "2024-06-15",
            numOfPkg: 1,
            keyStage: "Grade 4-6",
            remarks: "",
            schoolID: "119311",
        },
        {
            batchNo: "Batch 29",
            deliveryDate: "2024-04-10",
            numOfPkg: 1,
            keyStage: "Kinder-Grade 3",
            remarks: "",
            schoolID: "119311",
        },
    ];

    // Filter schools based on search & dropdowns
    const filteredSchools = schoolList.filter(
        (school) =>
            school.schoolName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) &&
            (divisionFilter === "All" || school.division === divisionFilter) &&
            (municipalityFilter === "All" ||
                school.municipality === municipalityFilter) &&
            (classificationFilter === "All" ||
                school.classification === classificationFilter)
    );

    // Filter DCP Details based on selected school
    const filteredDCPs = selectedSchool
        ? dcpDetails.filter((dcp) => dcp.schoolID === selectedSchool)
        : [];

    return (
        <div>
            <h1>School DCP</h1>
            {/* Add content for school-related DCPs */}
        </div>
    );
};

export default SchoolDCP;
