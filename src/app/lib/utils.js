export async function login(email, password) {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    // Handle response errors
    if (!response.ok) {
        console.error("Login failed:", response);
        // return null; // This will trigger 401 in NextAuth
    }

    const data = await response.json(); // Parse response body
    return data; // Ensure it returns an object with { id, name, email }
}