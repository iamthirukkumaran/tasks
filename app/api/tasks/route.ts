import { TaskModel } from '@/models/Task';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await TaskModel.getAllTasks();
    
    // Convert MongoDB ObjectId to string for serialization
    const serializedTasks = tasks.map(task => ({
      ...task,
      _id: task._id.toString(),
      createdAt: task.createdAt.toISOString()
    }));
    
    return NextResponse.json(serializedTasks);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    const newTask = await TaskModel.createTask({ title: title.trim() });
    
    const serializedTask = {
      ...newTask,
      _id: newTask._id.toString(),
      createdAt: newTask.createdAt.toISOString()
    };

    return NextResponse.json(serializedTask, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}