// Assuming activeDays is already set from your calendar.js code
const activeDays = JSON.parse(localStorage.getItem("activeDays")) || [];

// Function to extract the month from a date string (YYYY-MM-DD)
function getMonthFromDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

// Group active days by month
const activeDaysByMonth = {};
activeDays.forEach(day => {
    const month = getMonthFromDate(day);
    if (!activeDaysByMonth[month]) {
        activeDaysByMonth[month] = 0;
    }
    activeDaysByMonth[month]++;
});

// Prepare data for Chart.js
const months = Object.keys(activeDaysByMonth);
const activityCounts = months.map(month => activeDaysByMonth[month]);

// Create a bar chart using Chart.js
const ctx = document.getElementById('activityChart').getContext('2d');
const activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: months,  // Months of activity
        datasets: [{
            label: 'Active Days per Month',
            data: activityCounts,  // Number of active days in each month
            backgroundColor: '#3498db',  // Color of the bars
            borderColor: '#2980b9',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
