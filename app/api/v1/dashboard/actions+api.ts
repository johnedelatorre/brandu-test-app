export async function GET(request: Request) {
  try {
    // Mock action items - in production, this would come from your database
    const actions = [
      {
        id: '1',
        title: 'Update LinkedIn headline',
        description: 'Optimize your professional headline for better visibility',
        completed: false,
        priority: 'high'
      },
      {
        id: '2',
        title: 'Post weekly industry insight',
        description: 'Share your expertise on current industry trends',
        completed: true,
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Engage with 5 industry leaders',
        description: 'Comment meaningfully on posts from thought leaders',
        completed: false,
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Update portfolio website',
        description: 'Add recent projects and testimonials',
        completed: false,
        priority: 'low'
      },
      {
        id: '5',
        title: 'Schedule content for next week',
        description: 'Plan and schedule 3 posts for the upcoming week',
        completed: false,
        priority: 'high'
      }
    ];

    return Response.json(actions);
  } catch (error) {
    console.error('Dashboard actions API error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const actionId = pathParts[pathParts.length - 1];
    
    const { completed } = await request.json();

    // In production, you would update the action item in your database
    console.log(`Updating action ${actionId} to completed: ${completed}`);

    return Response.json({
      success: true,
      message: 'Action item updated successfully'
    });
  } catch (error) {
    console.error('Update action API error:', error);
    return Response.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}