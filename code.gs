const SPREADSHEET_ID = "1LvYgk-EbSosbKvrFXPyW0pQCXClsu9HHJIo4-T9I6cc";
const SHEET_NAME = "Sheet1";

function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if(!sheet) sheet = ss.insertSheet(SHEET_NAME);
  const header = ["Date","H Number","Patient Name","Age","Hospital Name","Doctor Name","Information","Containers","Test Name"];
  if(sheet.getLastRow() === 0){
    sheet.getRange(1,1,1,header.length).setValues([header]);
  }
}

function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) ? e.parameter.action : "list";
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();

    if(action === "list"){
      const dataRange = sheet.getRange(2,1, Math.max(0,lastRow-1), 9);
      const values = dataRange.getValues();
      return ContentService.createTextOutput(JSON.stringify({records: values})).setMimeType(ContentService.MimeType.JSON);
    }

    if(action === "next"){
      const count = Math.max(0,lastRow-1);
      const year = new Date().getFullYear();
      const hNumber = "H-" + String(count + 1).padStart(4,'0') + "/" + year;
      return ContentService.createTextOutput(JSON.stringify({hNumber: hNumber})).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({error:"Unknown action"})).setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e){
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const entry = payload.entry;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if(action === "add"){
      const row = [
        entry.date || "",
        entry.hNumber || "",
        entry.patientName || "",
        entry.age || "",
        entry.hospital || "",
        entry.doctor || "",
        entry.info || "",
        entry.containers || "",
        entry.testName || ""
      ];
      sheet.appendRow(row);
      return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
    }

    if(action === "update"){
      const hnum = entry.hNumber;
      const data = sheet.getRange(2,2, sheet.getLastRow()-1, 1).getValues();
      let foundRow = -1;
      for(let i=0;i<data.length;i++){
        if(String(data[i][0]) === String(hnum)){
          foundRow = i + 2;
          break;
        }
      }

      const values = [
        entry.date || "",
        entry.hNumber || "",
        entry.patientName || "",
        entry.age || "",
        entry.hospital || "",
        entry.doctor || "",
        entry.info || "",
        entry.containers || "",
        entry.testName || ""
      ];

      if(foundRow === -1){
        sheet.appendRow(values);
      } else {
        sheet.getRange(foundRow,1,1,9).setValues([values]);
      }
      return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({error:"Unknown action"})).setMimeType(ContentService.MimeType.JSON);
  } catch(err){
    return ContentService.createTextOutput(JSON.stringify({error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
