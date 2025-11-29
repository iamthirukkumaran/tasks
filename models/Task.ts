import clientPromise from '../lib/mongodb';
import { ObjectId } from 'mongodb';

const DATABASE_NAME = 'team-tasks-board';
const COLLECTION_NAME = 'tasks';

export interface Task {
  _id: ObjectId;
  title: string;
  status: 'pending' | 'done';
  createdAt: Date;
}

export interface TaskInput {
  title: string;
  status: 'pending' | 'done';
  createdAt: Date;
}

export class TaskModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    return db.collection<TaskInput>(COLLECTION_NAME);
  }

  static async getAllTasks() {
    try {
      const collection = await this.getCollection();
      const tasks = await collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return tasks;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  }

  static async createTask(taskData: { title: string }) {
    try {
      const collection = await this.getCollection();
      const task: TaskInput = {
        title: taskData.title,
        status: 'pending' as const,
        createdAt: new Date()
      };
      const result = await collection.insertOne(task);
      return { _id: result.insertedId, ...task };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async markAsDone(taskId: string) {
    try {
      const collection = await this.getCollection();
      let objectId;
      
      try {
        objectId = new ObjectId(taskId);
      } catch (error) {
        throw new Error('Invalid task ID format');
      }

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { status: 'done' } }
      );
      
      if (result.matchedCount === 0) {
        throw new Error('Task not found');
      }
      
      return result;
    } catch (error) {
      console.error('Error marking task as done:', error);
      throw error;
    }
  }
}