// Configuration for Golden Jubilee Tributes Redirection & Google Drive Uploads

export interface TributeLinksConfig {
  // Google Apps Script Web App URL for direct automated uploads to Google Drive
  googleAppsScriptUploadUrl: string;

  parents: {
    title: string;
    shortLabel: string;
    description: string;
    url: string;
    buttonLabel: string;
  };
  teachersAlumni: {
    title: string;
    shortLabel: string;
    description: string;
    url: string;
    buttonLabel: string;
    maxVideoDurationSeconds: number;
  };
}

export const TRIBUTE_LINKS_CONFIG: TributeLinksConfig = {
  // Google Apps Script Web App URL for automated uploads to Google Drive:
  googleAppsScriptUploadUrl: "https://script.google.com/macros/s/AKfycbzedyrSMkaHsMqT1oIOMqbkc02tHZsbApRohKzxqR9QTcjc6qgxzFZO6HI2gwgrxvqh/exec",

  parents: {
    title: "Parents' Note & Photo Memory",
    shortLabel: "For Parents",
    description: "Write a special jubilee note, prayer, or congratulatory message for St. Mary's School and upload a student or family photo for the Golden Jubilee archive.",
    url: "https://forms.gle/stmarys-parents-jubilee-wishes",
    buttonLabel: "Open Parents' Form / Link",
  },
  teachersAlumni: {
    title: "Teachers & Alumni Video Tribute",
    shortLabel: "For Teachers & Alumni",
    description: "Upload a short video message (under 1 minute) sharing your cherished memories, gratitude to mentors, and golden jubilee greetings.",
    url: "https://forms.gle/stmarys-teachers-alumni-videos",
    buttonLabel: "Open Video Upload Link",
    maxVideoDurationSeconds: 60,
  },
};
