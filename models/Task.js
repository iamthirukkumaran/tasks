import clientPromise from '../lib/mongodb'
import { ObjectId } from 'mongodb'

const DATABASE_NAME = 'team-tasks-board'
const COLLECTION_NAME = 'tasks'

class Task {
  static async getCollection() {
    const client = await clientPromise
    const db = client.db(DATABASE_NAME)
    return db.collection(COLLECTION_NAME)
  }

  static async getAllTasks() {
    const collection = await this.getCollection()
    return await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async createTask(taskData) {
    const collection = await this.getCollection()
    const task = {
      title: taskData.title,
      status: 'pending',
      createdAt: new Date()
    }
    const result = await collection.insertOne(task)
    return { _id: result.insertedId, ...task }
  }

  static async markAsDone(taskId) {
    try {
      const collection = await this.getCollection()
      const objectId = new ObjectId(taskId)
      const result = await collection.updateOne(
        { _id: objectId },
        { $set: { status: 'done' } }
      )
      
      if (result.matchedCount === 0) {
        throw new Error('Task not found')
      }
      
      return result
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new Error('Invalid task ID format')
      }
      throw error
    }
  }

  static async deleteTask(taskId) {
    try {
      const collection = await this.getCollection()
      const objectId = new ObjectId(taskId)
      const result = await collection.deleteOne({ _id: objectId })
      
      if (result.deletedCount === 0) {
        throw new Error('Task not found')
      }
      
      return result
    } catch (error) {
      if (error.kind === 'ObjectId') {
        throw new Error('Invalid task ID format')
      }
      throw error
    }
  }
}

export { Task };
export const TaskModel = Task;