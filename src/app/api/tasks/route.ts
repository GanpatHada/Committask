import prisma from "@/lib/prisma";
import {addTodoSchema} from "@/schemas/task.schema"
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/requireAuth";
import ApiError from "@/lib/errors/apiError";
import { z } from "zod";

export async function GET(){
   try {
    const user = await requireAuth();
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
    });
    return NextResponse.json(
     {
       message: "User fetched",
       success: true,
       data: todos,
     },
     { status: 201 }
   );
   } catch (error: any) {
    console.log(error);
    const responseBody: any = {
      success: false,
      message: error.message,
    };
    if (error.errors && error.errors.length > 0) {
      responseBody.errors = error.errors.map(
        (e: { message: string }) => e.message || e
      );
    }
  }
}

export async function POST(req:Request) {
  try {
    let body = await req.text();
    if (!body.trim()) {
      throw new ApiError(400,"Body is missing")
    }
    body = JSON.parse(body);
    const parsedData = addTodoSchema.parse(body);

 
    const user=await requireAuth();
    const newTodo = await prisma.todo.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        dueDate: parsedData.dueDate,
        priority: parsedData.priority,
        userId:user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Task added successfully",
        success: true,
        data: newTodo,
      },
      { status: 201 }
    );
  } catch (error:any) {
    console.log(error);
    const responseBody:any={
      success: false,
      message: error.message
    }
     if(error instanceof z.ZodError)
            responseBody.message='Validation Error'
    if(error.errors && error.errors.length > 0)
      responseBody.errors=error.errors.map((e:{ message: string }) => e.message || e);
     return NextResponse.json(responseBody,{status: error.statusCode});
  }
}

