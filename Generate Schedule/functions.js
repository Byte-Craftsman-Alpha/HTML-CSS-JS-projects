const scheduleData = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
};

// Function to generate the schedule grid dynamically
function generateScheduleGrid() {
    const tbody = document.querySelector('#schedule-grid tbody');
    const tableHeader = document.getElementById('table-header');
    tbody.innerHTML = ''; // Clear existing rows
    tableHeader.innerHTML = '<th>Time / Day</th>'; // Reset the header

    // Get all the unique time ranges from the scheduleData
    const allTimeRanges = new Set();
    const daysWithSchedules = [];

    // Loop through schedule data to get unique time ranges and days with tasks
    Object.keys(scheduleData).forEach(day => {
        if (scheduleData[day].length > 0) {
            daysWithSchedules.push(day); // Track days with schedules
            scheduleData[day].forEach(schedule => {
                const start = schedule.startTime;
                const end = schedule.endTime;

                // Create time range "HH:MM-HH:MM"
                const timeRange = `${start} - ${end}`;
                allTimeRanges.add(timeRange);
            });
        }
    });

    // Sort the time ranges
    const sortedTimeRanges = Array.from(allTimeRanges).sort((a, b) => {
        const [aStart, aEnd] = a.split(' - ');
        const [bStart, bEnd] = b.split(' - ');
        return aStart.localeCompare(bStart);
    });

    // Create header for the days with schedules
    daysWithSchedules.forEach(day => {
        const dayHeaderCell = document.createElement('th');
        dayHeaderCell.textContent = day;
        tableHeader.appendChild(dayHeaderCell);
    });

    // Create rows based on unique time ranges
    sortedTimeRanges.forEach(timeRange => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = timeRange;
        row.appendChild(timeCell);

        // Add empty cells for each day with schedules
        daysWithSchedules.forEach(day => {
            const cell = document.createElement('td');
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // Populate the grid with schedules
    Object.keys(scheduleData).forEach(day => {
        const daySchedules = scheduleData[day];
        if (daySchedules.length > 0) {
            daySchedules.forEach(schedule => {
                const { startTime, endTime, heading, body, color } = schedule;
                const timeRange = `${startTime} - ${endTime}`;
                const dayIndex = daysWithSchedules.indexOf(day) + 1;

                const rows = Array.from(tbody.rows);
                rows.forEach(row => {
                    const timeCell = row.cells[0].textContent;
                    if (timeCell === timeRange) {
                        const scheduleItem = document.createElement('div');
                        scheduleItem.classList.add('schedule-item', color);
                        scheduleItem.innerHTML = `<strong>${heading}</strong><p>${body.replaceAll("\n","<br>")}</p>`;
                        row.cells[dayIndex].appendChild(scheduleItem);
                    }
                });
            });
        }
    });
}
