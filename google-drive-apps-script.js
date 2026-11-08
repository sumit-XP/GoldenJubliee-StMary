/**
 * ST. MARY'S SCHOOL, JAJPUR ROAD - 50TH GOLDEN JUBILEE (1976 - 2026)
 * GOOGLE APPS SCRIPT: AUTOMATED GOOGLE DRIVE UPLOADER FOR TRIBUTES
 * 
 * Auto-detects the folder named "St Marys Jubilee Tributes" so all uploads
 * automatically go directly INSIDE this folder!
 */

var FOLDER_NAME = "St Marys Jubilee Tributes";

// Automatically finds or creates the "St Marys Jubilee Tributes" folder
function getTargetFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  }
  return DriveApp.createFolder(FOLDER_NAME);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return responseJSON({ status: "error", message: "No post data received" });
    }

    var data = JSON.parse(e.postData.contents);
    
    // Automatically get the "St Marys Jubilee Tributes" folder
    var folder = getTargetFolder();

    // Decode file base64 data
    var decoded = Utilities.base64Decode(data.base64Data);
    var blob = Utilities.newBlob(decoded, data.mimeType || "application/octet-stream", data.fileName || "tribute_file");
    
    // Save file directly INSIDE the folder
    var file = folder.createFile(blob);
    
    // Allow anyone with the link to view
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
      mimeType: file.getMimeType(),
      folderName: folder.getName()
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
  var folder = getTargetFolder();
  return responseJSON({
    status: "online",
    school: "St. Mary's School Jubilee Uploader",
    targetFolder: folder.getName(),
    timestamp: new Date().toISOString()
  });
}
