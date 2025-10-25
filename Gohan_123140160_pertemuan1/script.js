document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const formError = document.getElementById('form-error');
    const searchInput = document.getElementById('search-input');
    const filterStatus = document.getElementById('filter-status');
    const tasksPendingCount = document.getElementById('tasks-pending-count');

    // Load tasks from localStorage when the page loads
    let tasks = loadTasks();
    renderTasks();
    updateStats();

    // --- 1. Fungsi CRUD dan LocalStorage ---

    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- 2. Tambah Tugas (Create) ---
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('task-name').value.trim();
        const course = document.getElementById('task-course').value.trim();
        const deadline = document.getElementById('task-deadline').value;

        // Validasi Form
        if (name === "" || course === "" || deadline === "") {
            formError.textContent = "Semua field harus diisi!";
            formError.style.display = 'block';
            return;
        }

        formError.style.display = 'none';

        const newTask = {
            id: Date.now(), // ID unik
            name,
            course,
            deadline,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateStats(); // Update statistik setelah tambah tugas
        taskForm.reset();
    });

    // --- 3. Kelola Aksi Tugas (Update/Delete) ---
    taskList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (!listItem) return;

        const taskId = parseInt(listItem.dataset.id);

        // Hapus Tugas (Delete)
        if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
            updateStats(); // Update statistik setelah hapus
        }

        // Tandai Selesai (Update Status)
        if (e.target.classList.contains('complete-btn')) {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = !tasks[taskIndex].completed;
                saveTasks();
                renderTasks();
                updateStats(); // Update statistik setelah perubahan status
            }
        }
    });

    // --- 4. Fungsi Rendering, Filter, dan Statistik ---

    function renderTasks() {
        taskList.innerHTML = '';

        const filterText = searchInput.value.toLowerCase();
        const filterVal = filterStatus.value;

        // Terapkan Filter
        const filteredTasks = tasks.filter(task => {
            // Filter Pencarian (Nama Tugas atau Mata Kuliah)
            const matchesSearch = task.name.toLowerCase().includes(filterText) || 
                                  task.course.toLowerCase().includes(filterText);

            // Filter Status (All, Pending, Completed)
            const matchesStatus = filterVal === 'all' || 
                                  (filterVal === 'completed' && task.completed) ||
                                  (filterVal === 'pending' && !task.completed);

            return matchesSearch && matchesStatus;
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li style="justify-content: center;">Tidak ada tugas yang cocok.</li>';
            return;
        }

        // Buat elemen HTML untuk setiap tugas
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.classList.add(task.completed ? 'task-completed' : 'task-pending');

            li.innerHTML = `
                <div class="task-info">
                    <h3>${task.name}</h3>
                    <p>Mata Kuliah: ${task.course} | Deadline: ${task.deadline}</p>
                </div>
                <div class="actions">
                    <button class="complete-btn">
                        ${task.completed ? 'Batal Selesai' : 'Selesai'}
                    </button>
                    <button class="delete-btn">Hapus</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function updateStats() {
        // Hitung tugas yang belum selesai
        const pendingCount = tasks.filter(task => !task.completed).length;
        tasksPendingCount.textContent = pendingCount;
    }
    
    // Event listener untuk Filter dan Pencarian
    searchInput.addEventListener('input', renderTasks);
    filterStatus.addEventListener('change', renderTasks);
});