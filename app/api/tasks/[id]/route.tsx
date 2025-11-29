import { TaskModel } from '@/models/Task';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    await TaskModel.markAsDone(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in PATCH /api/tasks/[id]:', error);
    
    if (error.message === 'Invalid task ID format') {
      return NextResponse.json(
        { error: 'Invalid task ID format' },
        { status: 400 }
      );
    }
    
    if (error.message === 'Task not found') {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}