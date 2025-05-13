import Papa from "papaparse";
import { useFetch } from "#app";

interface RawBand {
  "Tijdstempel": string;
  "Naam": string;
  "Beschrijving": string;
  "Foto": string;
  "URL Website": string;
  "URL Youtube filmpje": string;
  "Plaats": string;
  "Tijdstip": string;
  "Jaar": string;
}

interface Band {
  location: string;
  time: string | null;
  bandPhoto: string;
  bandName: string;
  website: string | null;
  video: string | null;
  description: string;
  lookupName: string;
}

function transformGoogleDriveUrl(url: string): string {
  // Check if the URL is a Google Drive URL with the "open" format
  if (url && url.includes("drive.google.com/open?id=")) {
    // Extract the file ID
    const fileIdMatch = url.match(/id=([^&]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      // This format has better access permissions for images
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  // Return the original URL if it's not a Google Drive URL or if transformation fails
  return url;
}

export async function useBands(): Promise<Record<string, Band[]>> {
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTCU39iFMnnZrOLFJG1wLrpK_8j-6CcBvB9tFU73swwyeOlOyLtvSwT6WStoYhi5VvG8JibOdtKOxeC/pub?gid=761994323&single=true&output=csv";

  // Add retry functionality
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let csvData: string | null = null;

  while (retryCount < MAX_RETRIES) {
    try {
      const response = await useFetch<string>(csvUrl, {
        responseType: "text",
        key: `bands-csv-${Date.now()}`, // Unique key to prevent caching issues
        cache: false, // Disable cache to ensure fresh data
        timeout: 10000, // 10 second timeout
      });

      csvData = response.data.value;

      if (csvData && csvData.length > 0) {
        break; // Successfully got data, exit retry loop
      } else {
        console.warn(
          `Empty CSV response on attempt ${retryCount + 1}/${MAX_RETRIES}`,
        );
        retryCount++;
        await new Promise((r) => setTimeout(r, 1000)); // Wait 1 second before retrying
      }
    } catch (error) {
      console.error(
        `Error fetching CSV on attempt ${retryCount + 1}/${MAX_RETRIES}:`,
        error,
      );
      retryCount++;
      await new Promise((r) => setTimeout(r, 1000)); // Wait 1 second before retrying
    }
  }

  if (!csvData) {
    console.error("Failed to fetch CSV data after retries");
    return {};
  }

  try {
    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (!parsed.data || parsed.data.length === 0) {
      console.error("CSV parsing produced empty data");
      return {};
    }

    const byYear: Record<string, Band[]> = {};

    for (const row of parsed.data) {
      // Check if this row has the expected fields
      if (!row.Jaar && !row.Naam) {
        console.warn("Row missing required fields:", row);
        continue;
      }

      const year = row.Jaar?.trim() || "";
      const name = row.Naam?.trim() || "";

      if (!year || !name) {
        console.warn("Skipping row with missing year or name:", row);
        continue;
      }

      const lookupName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "-") // vervangt spaties, komma's, accenten etc.
        .replace(/-+/g, "-") // meerdere streepjes → één
        .replace(/^-|-$/g, ""); // trim leading/trailing dashes

      const band: Band = {
        location: row.Plaats?.trim() || "",
        time: row.Tijdstip?.trim() || null,
        bandPhoto: transformGoogleDriveUrl(row.Foto?.trim() || ""),
        bandName: name,
        website: row["URL Website"]?.trim() || null,
        video: row["URL Youtube filmpje"]?.trim() || null,
        description: row.Beschrijving?.trim() || "",
        lookupName,
      };

      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(band);
    }

    return byYear;
  } catch (parseError) {
    console.error("Error parsing CSV:", parseError);
    return {};
  }
}
