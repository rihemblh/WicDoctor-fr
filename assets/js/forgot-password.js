document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("forgotPasswordForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
console.log("email: ",email)
        try {
            const response = await fetch('https://wic-doctor.com:3004/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log("********************data: ",data)
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }

            // Assuming data.link contains the reset link
            alert('Un lien de réinitialisation de votre mot de passe a été envoyé à votre adresse e-mail: ' + email);
            console.log(data); // Log the response for debugging
            window.location.href="https://wic-doctor.com/login.html"

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });
});
