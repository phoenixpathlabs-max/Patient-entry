// -------------------------
// Get logged-in user
// -------------------------
const currentUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
if (!currentUser) {
  alert("Please login first!");
  window.location.href = "login.html";
}

/* -------------------------
   Prefilled hospital & doctor lists
   ------------------------- */
const hospitalOptions = [
  "AKSHA HOSPITALS","APOLLO B.G ROAD","CUREMAX","DR R. B. PATIL HOSPITAL",
  "DURGA HEALTHCARE","HIGHLAND HOSPITAL","HOSMAT 3","INDIANA HOSPITAL",
  "KCTRI","KIMS AL SHIFA","MIO HOSPITALS","MOTHERHOOD","NAMMA AROGYA",
  "NORTH WEST HOSPITAL","PATHOGENIX","PRIMA DIAGNOSTICS","SARALAYA",
  "SL. GASTRO & LIVER CLINIC","SRI PRAAGNA","SRI PRASHANTHI HOSPITAL",
  "SRINIVASA HOSPITALS","VENUS HEALTHCARE","SIRI LABS","GOVT MEDICAL COLLEGE",
  "CRIYA HOSPITALS","MANGALA HOSPITALS","BMJH HOSPITAL","SPARSHA DIAGNOSTICS",
  "AGILUS DIAGNOSTICS","HOSMAT H1","OYSTER","ALTOR","HOMAT 2",
  "FATHER MULLER HOSPITAL","PATHOGENIX LABS","APOLLO HOSPITAL",
  "NANJAPPA LIFE CARE SHIVAMOGGA","VIJAYSHREE HOSPITALS","UNITY HOSPITAL",
  "HAMILTON BAAILEY","KLE","RADON CANCER CENTRE","MAITHRI HOSPITAL",
  "HOSMAT 2","SOLARIS","APEX HOSPITALS","RAMAIAH MCH","HEALIUS HOSPITAL",
  "AROSYA","QXL","ARION RADIOTHERAPY","Y LABS MANGALORE","CANVA",
  "NEW LIFE HOSPITAL","SURGIDERMA","PATHCARE","SPARSH HOSPITAL",
  "SHANTI HOSPITAL","ASHWINI DIAGNOSTICS","SVM HOSPITAL"
];

const doctorOptions = [
  "DR HARI KIRAN","DR ADITHYA","DR AJAY KUMAR","DR ANIL KAMATH","DR ANITA DAND",
  "DR ANTHONY PIAS","DR ARAVIND","DR ASHWIN M","DR B J PRASAD REDDY","DR B. R. PATIL",
  "DR DINESH SHET","DR FAVAZ ALI M","DR GAURAV SHETTY","DR GURUPRASAD BHAT",
  "DR HARI KIRAN REDDY","DR HEMANTH KUMAR","DR INDUMATHY","DR KIRAN KATTIMANI",
  "DR KUSHAL","DR MADHUSHREE","DR MANOJ GOWDA","Dr NAVANEETH KAMATH",
  "DR NISHITHA SHETTY","DR SAHITHYA DESIREDDY","DR SHEELA","DR SHIVASHANKAR BHAT",
  "DR SHOBITHA RAO","DR SHRAVAN R","DR SIDDARTH S","DR SOWDIN REDDY",
  "DR SUMANTH BHOOPAL","DR SURESH RAO","DR SURYA SEN","DR SWASTHIK",
  "DR SYAMALA SRIDEVI","DR T.S RAO","DR VIJAY AGARWAL","DR VIJITH SHETTY",
  "DR VISHWANATH","Dr.ASHWIN","Dr.KRISHNA PRASAD","Dr.MEENAKSHI JAIN",
  "Dr.SAMSKRTHY P MURTHY","DR MANAS","DR ALKA C BHAT","DR GEETHA J P",
  "S S RAJU","DR LENON DISOUSA","DR ELDOY SALDANHA","DR NEELIMA",
  "DR MADHURI SUMANTH","DR ROOPESH","DR SUMAN KUMAR","DR VAMSEEDHAR",
  "DR AMIT KIRAN","DR VIKRAM MAIYA","DR DEEPU N K","DR JALAUDDIN AKBAR",
  "DR MERLIN","DR SAMSKRITI","DR SANGEETHA K","DR GOWRI","DR YAMINI",
  "DR RAVEENA","DR LYNSEL","DR SUDHAKAR","DR DINESH SHET","DR SANTHOSH",
  "DR NAVEEN GOPAL","DR ARAVIND N","DR NAVANEETH KAMATH","DR HARISHA K",
  "DR GURUCHANNA B","DR DINESH KADAM","DR BHAVANA SHERIGAR","DR AADARSH",
  "DR ABHIJITH SHETTY","MANGESH KAMATH","DR SHASHIDHAR","DR SANJEEV KULGOD",
  "DR BHUSHAN","K MADHAVA RAO","DR PAMPANAGOWDA","DR MOUNA B.M",
  "DR CHANDRA SHEKAR","DR DINESH","DR KRITHIKA","DR BUSHAN",
  "DR ROHAN CHANDRA GATTI","DR SHREYAS N M","DR SRIHARI","Ninan Thomas",
  "DR HARISH","DR SMITHA RAO","DR VENKATARAMANA","DR KIRANA PAILOOR",
  "Y SANATH HEGDE","Dr RANGANATH","Dr SHIVA KUMAR","DR RAVKANTH",
  "DR SHYAMALA REDDY","KALPANA SRIDHAR","DR CHANDRAKANTH","DR MUSTAFA",
  "DR VIJAY KUMAR","DR SANDHYA RAVI","DR VIDYA V BHAT","DR NCP",
  "DR SUNIL KUMAR","NITHIN","APOORVA S","DR SHIVA PRASAD G",
  "DR CHANDANA PAI","DR CHAITHRA BHAT"
];

/* -------------------------
   Local storage keys
   ------------------------- */
const LS_KEYS = {
  PATIENTS: "patients_records_v1",
  HOSPITALS: "custom_hospitals_v1",
  DOCTORS: "custom_doctors_v1",
  USER_LOGS: "user_logs_v1"
};

function $(id){ return document.getElementById(id); }
function nowDateString(){ return new Date().toLocaleDateString(); }
function nowDateTime(){ return new Date().toLocaleString(); }

/* -------------------------
   Save login log (only once per login)
   ------------------------- */
(function logUserLogin(){
  let logs = JSON.parse(localStorage.getItem(LS_KEYS.USER_LOGS) || "[]");
  logs.push({
    username: currentUser?.id || "Unknown",
    role: currentUser?.role || "user",
    time: nowDateTime()
  });
  localStorage.setItem(LS_KEYS.USER_LOGS, JSON.stringify(logs));
})();

/* -------------------------
   Logout setup
   ------------------------- */
function setupLogout() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  // Logout button
  const logoutBtn = document.createElement("button");
  logoutBtn.innerText = "Logout";
  logoutBtn.className = "nav-btn";
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
  nav.appendChild(logoutBtn);

  // Logs button only for admin
  if (currentUser?.role === "admin") {
    const logsBtn = document.createElement("a");
    logsBtn.innerText = "Logs";
    logsBtn.href = "logs.html";
    logsBtn.className = "nav-btn";
    nav.appendChild(logsBtn);
  }
}

/* -------------------------
   Populate hospital/doctor lists
   ------------------------- */
function loadCustomLists(){
  let customHosp = JSON.parse(localStorage.getItem(LS_KEYS.HOSPITALS) || "[]");
  let customDocs = JSON.parse(localStorage.getItem(LS_KEYS.DOCTORS) || "[]");
  return {
    hospitals: Array.from(new Set([...hospitalOptions, ...customHosp])).sort(),
    doctors: Array.from(new Set([...doctorOptions, ...customDocs])).sort()
  };
}

function populateDatalists(){
  let lists = loadCustomLists();
  let hdl = $("hospitalList");
  let ddl = $("doctorList");
  if(hdl){
    hdl.innerHTML = "";
    lists.hospitals.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; hdl.appendChild(opt);
    });
  }
  if(ddl){
    ddl.innerHTML = "";
    lists.doctors.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v; ddl.appendChild(opt);
    });
  }
}

/* -------------------------
   H Number Handling
   ------------------------- */
function getLastHNumber() {
  let patients = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
  if (patients.length === 0) return null;
  return patients[patients.length - 1].hNumber;
}

function formatHNumber(num) {
  return "H-" + String(num).padStart(4, "0") + "/2026";
}

function previewNextHNumber() {
  let lastH = getLastHNumber();
  let nextNum = 1;
  if (lastH) {
    let parts = lastH.split("-");
    if (parts.length > 1) {
      let numPart = parts[1].split("/")[0];
      nextNum = parseInt(numPart) + 1;
    }
  }
  let newH = formatHNumber(nextNum);
  $("hNumber").innerText = newH;
}

/* -------------------------
   Add New Option (Fix)
   ------------------------- */
function addNewOption(type){
  const value = prompt("Enter new " + type + " name:");
  if(!value) return;

  let key = type === "hospital" ? LS_KEYS.HOSPITALS : LS_KEYS.DOCTORS;
  let arr = JSON.parse(localStorage.getItem(key) || "[]");

  // Prevent duplicates
  if(arr.includes(value)){
    alert("⚠️ This " + type + " already exists!");
    return;
  }

  arr.push(value);
  localStorage.setItem(key, JSON.stringify(arr));

  alert("✅ " + type + " added successfully!");
  populateDatalists(); // refresh dropdowns
}

/* -------------------------
   Save Entry
   ------------------------- */
function attachFormHandler(){
  $("patientForm").addEventListener("submit", function(e){
    e.preventDefault();

    let hNumber = $("hNumber").innerText;
    let entry = {
      date: nowDateString(),
      hNumber,
      patientName: $("patientName").value,
      age: $("age").value,
      hospital: $("hospitalInput").value,
      doctor: $("doctorInput").value,
      info: $("info").value,
      containers: $("containers").value,
      testName: $("testName").value,
      username: currentUser?.id || "Unknown"   // ✅ Save username automatically
    };

    // Save locally
    let patients = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
    patients.push(entry);
    localStorage.setItem(LS_KEYS.PATIENTS, JSON.stringify(patients));

    // Show next available H-number
    previewNextHNumber();
    this.reset();
    populateDatalists();
    alert("✅ Entry saved locally!");
  });
}

/* -------------------------
   Records
   ------------------------- */
function loadRecords(){
  let records = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
  renderRecords(records);
}

function renderRecords(records){
  const tbody = document.querySelector("#recordsTable tbody");
  if(!tbody) return;
  tbody.innerHTML = "";
  records.forEach((r,idx)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.date||""}</td>
      <td>${r.hNumber||""}</td>
      <td>${r.patientName||""}</td>
      <td>${r.age||""}</td>
      <td>${r.hospital||""}</td>
      <td>${r.doctor||""}</td>
      <td>${r.info||""}</td>
      <td>${r.containers||""}</td>
      <td>${r.testName||""}</td>
      <td>${r.username||"Unknown"}</td>
     <td>
        <button class="edit-btn" data-idx="${idx}">Edit</button>
        ${currentUser?.role === "admin" ? `<button class="delete-btn" data-idx="${idx}">Delete</button>` : ""}
     </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach Edit
  tbody.querySelectorAll(".edit-btn").forEach(btn=>{
    btn.addEventListener("click", function(){
      openEditModal(parseInt(this.dataset.idx,10));
    });
  });

  // Attach Delete
  tbody.querySelectorAll(".delete-btn").forEach(btn=>{
    btn.addEventListener("click", function(){
      const idx = parseInt(this.dataset.idx,10);
      if(confirm("Are you sure you want to delete this entry?")){
        const arr = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS)||"[]");
        arr.splice(idx,1);
        localStorage.setItem(LS_KEYS.PATIENTS, JSON.stringify(arr));
        renderRecords(arr);
      }
    });
  });
}

function attachSearch(){
  const s = $("searchBox");
  if(!s) return;
  s.addEventListener("keyup", function(){
    const q = this.value.trim().toLowerCase();
    const records = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
    const filtered = records.filter(r => {
      return (r.hNumber||"").toLowerCase().includes(q) ||
             (r.patientName||"").toLowerCase().includes(q) ||
             (r.username||"").toLowerCase().includes(q);
    });
    renderRecords(filtered);
  });
}

/* -------------------------
   Edit Modal
   ------------------------- */
function openEditModal(idx){
  const stored = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
  if(idx < 0 || idx >= stored.length) return;
  const rec = stored[idx];

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const lists = loadCustomLists();
  const hospitalOpts = lists.hospitals.map(h=>`<option value="${h}">`).join("");
  const doctorOpts = lists.doctors.map(d=>`<option value="${d}">`).join("");

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <h3>Edit Entry</h3>
    <label>H Number</label>
    <input type="text" value="${rec.hNumber}" disabled />
    <label>Patient Name</label>
    <input type="text" id="m_patientName" value="${rec.patientName||""}" />
    <label>Age</label>
    <input type="text" id="m_age" value="${rec.age||""}" />
    <label>Hospital</label>
    <input list="m_hospitalList" id="m_hospital" value="${rec.hospital||""}" />
    <datalist id="m_hospitalList">${hospitalOpts}</datalist>
    <label>Doctor</label>
    <input list="m_doctorList" id="m_doctor" value="${rec.doctor||""}" />
    <datalist id="m_doctorList">${doctorOpts}</datalist>
    <label>Information</label>
    <textarea id="m_info">${rec.info||""}</textarea>
    <label>Containers</label>
    <input type="text" id="m_containers" value="${rec.containers||""}" />
    <label>Test Name</label>
    <select id="m_testName">
      <option ${rec.testName==="SMALL"?"selected":""}>SMALL</option>
      <option ${rec.testName==="MEDIUM"?"selected":""}>MEDIUM</option>
      <option ${rec.testName==="LARGE"?"selected":""}>LARGE</option>
      <option ${rec.testName==="EXTRA LARGE"?"selected":""}>EXTRA LARGE</option>
      <option ${rec.testName==="IHC"?"selected":""}>IHC</option>
      <option ${rec.testName==="EXPERT OPINION"?"selected":""}>EXPERT OPINION</option>
    </select>
    <p><b>Entered By:</b> ${rec.username||"Unknown"}</p>
    <div style="margin-top:10px;">
      <button id="m_save">Save</button>
      <button id="m_cancel">Cancel</button>
    </div>
  `;
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  $("m_cancel").addEventListener("click", ()=> backdrop.remove());
  $("m_save").addEventListener("click", ()=>{
    rec.patientName = $("m_patientName").value;
    rec.age = $("m_age").value;
    rec.hospital = $("m_hospital").value;
    rec.doctor = $("m_doctor").value;
    rec.info = $("m_info").value;
    rec.containers = $("m_containers").value;
    rec.testName = $("m_testName").value;

    const arr = JSON.parse(localStorage.getItem(LS_KEYS.PATIENTS) || "[]");
    arr[idx] = rec;
    localStorage.setItem(LS_KEYS.PATIENTS, JSON.stringify(arr));
    renderRecords(arr);
    backdrop.remove();
  });
}

/* -------------------------
   Init
   ------------------------- */
window.addEventListener("DOMContentLoaded", ()=>{
  if($("todayDate")) $("todayDate").innerText = nowDateString();
  populateDatalists();
  if($("patientForm")){ previewNextHNumber(); attachFormHandler(); }
  if(document.querySelector("#recordsTable")){ loadRecords(); attachSearch(); }
  setupLogout})
