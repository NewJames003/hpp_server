document.getElementById('download-btn').addEventListener('click', function() {
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    function getOperatingSystem() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Win") !== -1) return "Windows";
        if (userAgent.indexOf("Mac") !== -1) return "MacOS";
        if (userAgent.indexOf("Linux") !== -1) return "Linux";
        if (userAgent.indexOf("CrOS") !== -1) return "ChromeOS";
        return "Unknown";
    }

    if (isMobileDevice()) {
        const link = document.createElement('a');
    link.href = 'pages/More/login.html'; // Replace with the actual path to your PDF file\
    link.click();
        // alert("Error: This action is not supported on mobile devices.");
    } else {
    const link = document.createElement('a');
    // link.href = '/public/pages/download.html';
    link.href = 'pages/More/login.html'; // Replace with the actual path to your PDF file\

    link.click();
    }
    });