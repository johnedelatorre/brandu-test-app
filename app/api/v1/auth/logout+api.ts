export async function POST(request: Request) {
  try {
    // In a real app, you would invalidate the session/token here
    return Response.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout API error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}