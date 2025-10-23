// Login Page JavaScript

// Check if already authenticated
if (Auth.isAuthenticated()) {
  window.location.href = "index.html";
}
// const google=document.getElementById('btn-g')
// const facebook=document.getElementById('btn-fb')
// google.addEventListener('click',()=>{
//     Auth.loginWithGoogle()
// })
// facebook.addEventListener('click',()=>{
//     Auth.loginWithFacebook()
// })

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const submitBtn = e.target.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";

    const result = await Auth.login(email, password);

    if (result.success) {
      toast.success("Login successful!");

      // Redirect
      const redirectUrl = getUrlParam("redirect") || "index.html";
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 500);
    }
  } catch (error) {
    toast.error(error.message || "Invalid email or password");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Login";
  }
});
