exports.getSalesAmount = (data, date_by = null) => {
    const currentDate = date_by != null ? new Date(date_by) : new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let totalAmountToday = 0;
    let totalAmountCurrentMonth = 0;
    let totalAmountCurrentYear = 0;

    for (const item of data) {
        const itemDate = new Date(item.added_on);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth();
        const itemDay = itemDate.getDate();

        if (itemYear === currentYear) {
            totalAmountCurrentYear += parseFloat(item.total_amount);

            if (itemMonth === currentMonth) {
                totalAmountCurrentMonth += parseFloat(item.total_amount);

                if (itemDay === currentDate.getDate()) {
                    totalAmountToday += parseFloat(item.total_amount);
                }
            }
        }
    }

    return {
        totalAmountToday: totalAmountToday.toFixed(2),
        totalAmountCurrentMonth: totalAmountCurrentMonth.toFixed(2),
        totalAmountCurrentYear: totalAmountCurrentYear.toFixed(2)
    }
}

exports.getMonthlyData = (jsonData) => {
    const data = jsonData;
    const monthlyTotals = {};
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    for (let i = 0; i <= currentMonth; i++) {
        const month = monthNames[i];
        monthlyTotals[month] = 0;
    }

    // Calculate totals based on available data
    data.forEach(obj => {
        const totalAmount = parseFloat(obj.total_amount);
        const addedOn = new Date(obj.added_on);
        const month = monthNames[addedOn.getMonth()];
        const year = addedOn.getFullYear();

        // Check if the data belongs to the current year and is within the available months
        if (year === currentYear && addedOn <= currentDate) {
            monthlyTotals[month] += totalAmount;
        }
    });
    const chartData = Object.keys(monthlyTotals).map(month => ({
        month,
        total_amount: monthlyTotals[month]
    }));
    return chartData;
}

exports.formatDailyChartData = (data) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    const chartData = {};

    for (let day = 1; day <= currentDay; day++) {
        chartData[day.toString()] = 0;
    }

    for (const item of data) {
        const date = new Date(item.added_on);
        const month = date.getMonth();
        const year = date.getFullYear();

        if (month === currentMonth && year === currentYear) {
            const day = date.getDate();
            if (day <= currentDay) {
                chartData[day.toString()] += parseFloat(item.total_amount);
            }
        }
    }

    const labels = Object.keys(chartData);
    const chartValues = Object.values(chartData);

    return {
        labels,
        datasets: [
            {
                label: 'Total Amount',
                data: chartValues,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 3,
                tension: 0.1,
            },
        ],
    };
}