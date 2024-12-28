const addBtn = document.getElementById('addBtn');
        const taskInput = document.getElementById('task');
        const startTimeInput = document.getElementById('startTime');
        const endTimeInput = document.getElementById('endTime');
        const timeList = document.getElementById('timeList');
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');

        const loadTasks = () => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.forEach(task => addTaskToList(task));
        };

        const addTaskToList = ({ task, startTime, endTime }) => {
            const timeItem = document.createElement('div');
            timeItem.className = 'time-item';
            timeItem.innerHTML = `
                <span>${task} (${startTime} - ${endTime})</span>
                <button onclick="confirmDeleteTask('${task}')">Delete</button>
            `;
            timeList.appendChild(timeItem);
        };

        const saveTask = ({ task, startTime, endTime }) => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ task, startTime, endTime });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };

        const confirmDeleteTask = (taskToDelete) => {
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to delete "${taskToDelete}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteTask(taskToDelete);
                    Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
                }
            });
        };

        const deleteTask = (taskToDelete) => {
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks = tasks.filter(task => task.task !== taskToDelete);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        };

        const renderTasks = () => {
            timeList.innerHTML = '';
            loadTasks();
        };

        addBtn.addEventListener('click', () => {
            const task = taskInput.value.trim();
            const startTime = startTimeInput.value;
            const endTime = endTimeInput.value;

            if (!task || !startTime || !endTime) {
                Swal.fire('Oops!', 'Please fill out all fields before adding a task.', 'error');
                return;
            }

            const taskData = { task, startTime, endTime };
            addTaskToList(taskData);
            saveTask(taskData);

            Swal.fire('Added!', 'Your task has been added successfully.', 'success');

            taskInput.value = '';
            startTimeInput.value = '';
            endTimeInput.value = '';
        });

        exportBtn.addEventListener('click', () => {
            const tasks = localStorage.getItem('tasks');
            const blob = new Blob([tasks], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tasks.json';
            a.click();
            URL.revokeObjectURL(url);

            Swal.fire('Exported!', 'Your tasks have been exported as a JSON file.', 'success');
        });

        importBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const tasks = JSON.parse(e.target.result);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                    Swal.fire('Imported!', 'Your tasks have been successfully imported.', 'success');
                };
                reader.readAsText(file);
            }
        });

        loadTasks();