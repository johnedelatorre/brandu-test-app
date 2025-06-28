export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Simple authentication logic
    // In production, you would validate against a real database
    const validCredentials = {
      email: 'john.edelatorre@gmail.com',
      password: 'Password123'
    };

    if (email === validCredentials.email && password === validCredentials.password) {
      // Return success with user data
      return Response.json({
        success: true,
        user: {
          email: email,
        }
      });
    } else {
      // Return error for invalid credentials
      return Response.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login API error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}