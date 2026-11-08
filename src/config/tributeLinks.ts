// Configuration for Golden Jubilee Tributes Redirection & Uploads
// You can update the URLs below to point directly to your official Google Forms, Drive links, or external portal.

export interface TributeLinksConfig {
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
  parents: {
    title: "Parents' Note & Photo Memory",
    shortLabel: "For Parents",
    description: "Write a special jubilee note, prayer, or congratulatory message for St. Mary's School and upload a student or family photo for the Golden Jubilee archive.",
    // Replace with your Google Form URL or designated submission link:
    url: "https://forms.gle/stmarys-parents-jubilee-wishes",
    buttonLabel: "Open Parents' Form / Link",
  },
  teachersAlumni: {
    title: "Teachers & Alumni Video Tribute",
    shortLabel: "For Teachers & Alumni",
    description: "Upload a short video message (under 1 minute) sharing your cherished memories, gratitude to mentors, and golden jubilee greetings.",
    // Replace with your Google Form URL or designated video drive link:
    url: "https://forms.gle/stmarys-teachers-alumni-videos",
    buttonLabel: "Open Video Upload Link",
    maxVideoDurationSeconds: 60,
  },
};
