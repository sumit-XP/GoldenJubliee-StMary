/**
 * ST. MARY'S SCHOOL, JAJPUR ROAD - 50TH GOLDEN JUBILEE (1976 - 2026)
 * GOOGLE APPS SCRIPT: AUTOMATED GOOGLE DRIVE UPLOADER FOR TRIBUTES
 * 
 * Instructions:
 * 1. Open Google Drive (https://drive.google.com) with the school's Google account.
 * 2. Create a folder named: "St Marys Jubilee Tributes"
 * 3. Open that folder, look at the URL in your browser bar.
 *    The folder ID is the part after /folders/:
 *    e.g., https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ -> ID is "1aBcDeFgHiJkLmNoPqRsTuVwXyZ"
 * 4. Paste that ID into FOLDER_ID below.
 * 5. Open https://script.google.com -> Click "New Project" -> Name it "St Marys Drive Uploader".
 * 6. Replace all code in Code.gs with this entire file.
 * 7. Click "Deploy" (top right) -> "New deployment"
 *    - Select type: "Web app"
 *    - Description: "Jubilee Drive Uploader"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (crucial so visitors on the school website can upload)
 * 8. Click "Deploy", approve permissions if prompted.
 * 9. Copy the "Web App URL" (ends in /exec) and provide it to the assistant or paste in src/config/tributeLinks.ts!
 */

var FOLDER_ID = "PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No post data received" });
    }

    var data = JSON.parse(e.postData.contents);
    
    // Get destination folder
    var folder;
    if (FOLDER_ID && FOLDER_ID !== "PASTE_YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE") {
      folder = DriveApp.getFolderById(FOLDER_ID);
    } else {
      folder = DriveApp.getRootFolder();
    }

    // Decode file base64 data
    var decoded = Utilities.base64Decode(data.base64Data);
    var blob = Utilities.newBlob(decoded, data.mimeType || "application/octet-stream", data.fileName || "tribute_file");
    
    // Save to Google Drive
    var file = folder.createFile(blob);
    
    // Allow anyone with the link to view (so it can be displayed/shared)
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Set file description with metadata
    if (data.submittedBy || data.role) {
      file.setDescription("Uploaded by: " + (data.submittedBy || "Anonymous") + " (" + (data.role || "Visitor") + ")");
    }

    return responseJSON({
      status: "success",
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      viewUrl: "https://drive.google.com/uc?id=" + file.getId() + "&export=download",
      fileName: file.getName(),
      mimeType: file.getMimeType()
    });

  } catch (err) {
    return responseJSON({
      status: "error",
      message: err.toString()
    });
  }
}

// Return formatted JSON response with CORS headers
function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return responseJSON({
    status: "online",
    service: "St. Mary's School Jubilee Drive Uploader",
    timestamp: new Date().toISOString()
  });
}
