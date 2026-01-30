const batchTable = document.getElementById("batchTable");
const modal = document.getElementById("modal");
const batchForm = document.getElementById("batchForm");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const searchBox = document.getElementById("searchBox");
const filterStatus = document.getElementById("filterStatus");

let batches = JSON.parse(localStorage.getItem("iron_lady_batches")) || [
  {
    name: "Silver Star Jan 2026",
    program: "Silver Star",
    date: "2026-01-15",
    enrollment: 45,
    status: "active",
  },
  {
    name: "Essentials Batch 12",
    program: "Iron Lady Essentials",
    date: "2026-02-01",
    enrollment: 30,
    status: "full",
  },
  {
    name: "Global Board Prep",
    program: "Global Board",
    date: "2026-01-20",
    enrollment: 12,
    status: "active",
  },
];

function saveToStorage() {
  localStorage.setItem("iron_lady_batches", JSON.stringify(batches));
}

function renderTable() {
  const searchTerm = searchBox.value.toLowerCase();
  const statusType = filterStatus.value;

  batchTable.innerHTML = "";

  const filtered = batches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm) ||
      b.program.toLowerCase().includes(searchTerm);
    const matchesStatus = statusType === "all" || b.status === statusType;
    return matchesSearch && matchesStatus;
  });

  filtered.forEach((batch, index) => {
    const realIndex = batches.indexOf(batch);
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><strong>${batch.name}</strong></td>
            <td>${batch.program}</td>
            <td>${batch.date}</td>
            <td>${batch.enrollment}/50</td>
            <td><span class="badge badge-${batch.status}">${batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}</span></td>
            <td class="actions">
                <button class="btn-icon" onclick="editBatch(${realIndex})">Edit</button>
                <button class="btn-icon btn-delete" onclick="deleteBatch(${realIndex})">Delete</button>
            </td>
        `;
    batchTable.appendChild(tr);
  });

  // Update stats
  document.getElementById("activeCount").innerText = batches.filter(
    (b) => b.status === "active",
  ).length;
  document.getElementById("learnerCount").innerText = batches.reduce(
    (acc, b) => acc + b.enrollment,
    0,
  );
}

function deleteBatch(index) {
  if (confirm("Are you sure you want to delete this batch?")) {
    batches.splice(index, 1);
    saveToStorage();
    renderTable();
  }
}

function editBatch(index) {
  const batch = batches[index];
  document.getElementById("editIndex").value = index;
  document.getElementById("name").value = batch.name;
  document.getElementById("program").value = batch.program;
  document.getElementById("date").value = batch.date;
  document.getElementById("status").value = batch.status;

  modalTitle.innerText = "Edit Batch";
  modal.style.display = "flex";
}

openModalBtn.onclick = () => {
  batchForm.reset();
  document.getElementById("editIndex").value = "";
  modalTitle.innerText = "Create New Batch";
  modal.style.display = "flex";
};

closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

batchForm.onsubmit = (e) => {
  e.preventDefault();
  const index = document.getElementById("editIndex").value;
  const newData = {
    name: document.getElementById("name").value,
    program: document.getElementById("program").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value,
    enrollment: index !== "" ? batches[index].enrollment : 0,
  };

  if (index !== "") {
    batches[index] = newData;
  } else {
    batches.push(newData);
  }

  saveToStorage();
  renderTable();
  modal.style.display = "none";
};

searchBox.oninput = renderTable;
filterStatus.onchange = renderTable;

// Initial Render
renderTable();
