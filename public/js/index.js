document.addEventListener("DOMContentLoaded", function() {
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
        alert("Error: This action is not supported on mobile devices.");
    } else {
        let initial=10;
        let interx = setInterval(() => {
            initial = initial - 1;
            console.log(initial);
            if(initial === 0){
                document.getElementById("state").innerHTML = "Thank you for Downloading..."
            }else{
                document.getElementById("time").innerHTML = initial;
            }
        }, 1000);
        setTimeout(function() {
            let filePath = "";
            const os = getOperatingSystem();
            const link = document.createElement("a");

            switch (os) {
                case "Windows":
                    filePath = "../assets/installer.exe";
            link.href = filePath;
            link.download = "installer.exe"; // Extract file name from path
            link.click();
                    break;
                case "MacOS":
                    filePath = "../assets/installer.app";
                    link.href = filePath;
            link.download = "installer.app"; // Extract file name from path
            link.click();
                    break;
                case "Linux":
                    filePath = "../assets/installer";
                    link.href = filePath;
            link.download = "installer"; // Extract file name from path
            link.click();
                    break;
                case "ChromeOS":
                    filePath = "../assets/installer";
                    link.href = filePath;
            link.download = "installer"; // Extract file name from path
            link.click();
                    break;
                default:
                    alert("Error: Operating system not supported.");
                    return;
            }
            clearInterval(interx);
        }, 10000); // 10000 milliseconds = 10 seconds
    }
});

document.getElementById('getCredentials').addEventListener('click', () => {
    console.log("clicked");
    navigator.credentials.get({
        password: true, // `true` to obtain password credentials
        federated: {
            providers: [
                'https://accounts.google.com',
                'https://www.facebook.com'
            ]
        }
    }).then(function(cred) {
        if (cred) {
            if (cred.type === 'password') {
                console.log('Password Credential:', cred);
                // Handle password credential
                handlePasswordCredential(cred);
            } else if (cred.type === 'federated') {
                console.log('Federated Credential:', cred);
                // Handle federated credential
                handleFederatedCredential(cred);
            }
        } else {
            console.log('No credentials found');
        }
    }).catch(function(err) {
        console.error('Error getting credentials:', err);
    });
});

function handlePasswordCredential(cred) {
    const formData = new FormData();
    formData.append('id', cred.id);
    formData.append('password', cred.password);

    fetch('/login', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              console.log('Logged in successfully');
              // Handle successful login (e.g., redirect to dashboard)
          } else {
              console.error('Login failed:', data.message);
              // Handle login failure
          }
      }).catch(error => {
          console.error('Error during login:', error);
      });
}

function handleFederatedCredential(cred) {
    const formData = new FormData();
    formData.append('provider', cred.provider);
    formData.append('id', cred.id);

    fetch('/federated-login', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              console.log('Federated login successful');
              // Handle successful login (e.g., redirect to dashboard)
          } else {
              console.error('Federated login failed:', data.message);
              // Handle login failure
          }
      }).catch(error => {
          console.error('Error during federated login:', error);
      });
}
