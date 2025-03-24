import BASE_URL from "../../util/BaseUrl";

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

interface Package {
  packageId: number;
  status: string;
  component: string;
  serialNumber: string;
  assigned: string;
  remarks: string;
  configuration: Configuration;
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

export const getSchoolBatchListByBatchId = async (
  batchId: number
): Promise<SchoolBatchList[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/school_batch_list/batch/${batchId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Failed to fetch school batch list by batch ID. Status: ${response.status}, Message: ${errorMessage}`
      );
    }

    const responseData = await response.json();
    const data: SchoolBatchList[] = responseData;

    console.log("Fetched School Batch List by Batch ID:", data);
    return data;
  } catch (error) {
    console.error("Error fetching school batch list by batch ID:", error);
    throw error;
  }
};
