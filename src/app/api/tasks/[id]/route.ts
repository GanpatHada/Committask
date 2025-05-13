import ApiError from "@/lib/errors/apiError";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { TodoStatusSchema, updateTodoSchema } from "@/schemas/task.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// DELETE route handler
export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    // Safely destructure params and ensure `id` is a string
    const { id } = await params;
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Todo not found with this id");
    }

    // Authentication check
    const user = await requireAuth();

    // Check if Todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }

    // Authorization check
    if (existingTodo.userId !== user.id) {
      throw new ApiError(403, "Not authorized to delete this todo");
    }

    // Proceed with deletion
    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Task deleted successfully",
        success: true,
        data: id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const responseBody: any = {
      success: false,
      message: error.message,
    };
    if (error.errors && error.errors.length > 0) {
      responseBody.errors = error.errors.map((e: { message: string }) => e.message || e);
    }
    return NextResponse.json(responseBody, { status: error.statusCode || 500 });
  }
}

// PUT route handler
export async function PUT(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) 
{
  try {
    // Safely destructure params and ensure `id` is a string
    const { id } = await params;
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Todo not found with this id");
    }

    // Parse the request body
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    // Validate the parsed data using Zod schema
    const parsedData = updateTodoSchema.parse(body);

    // Authentication check
    const user = await requireAuth();

    // Check if Todo exists
    const existingTodo = await prisma.todo.findUnique({ where: { id } });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }

    // Authorization check
    if (existingTodo.userId !== user.id) {
      throw new ApiError(403, "Not authorized to update this todo");
    }

    // Proceed with the update
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { ...parsedData, id, userId: user.id },
    });

    return NextResponse.json(
      {
        message: "Task updated successfully",
        success: true,
        data: updatedTodo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const responseBody: any = {
      success: false,
      message: error.message,
    };

    // Handle validation error from Zod
    if (error instanceof z.ZodError) {
      responseBody.message = "Validation Error";
      responseBody.errors = error.errors.map((e) => e.message);
    }

    return NextResponse.json(responseBody, {
      status: error.statusCode || 500,
    });
  }
}


export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) 
{
  try {
    // Safely destructure params and ensure `id` is a string
    const { id } = await params;
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Todo not found with this id");
    }

    // Parse the request body
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    // Validate the parsed data using Zod schema
    const parsedData = TodoStatusSchema.parse(body);

    // Authentication check
    const user = await requireAuth();

    // Check if Todo exists
    const existingTodo = await prisma.todo.findUnique({ where: { id } });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }

    // Authorization check
    if (existingTodo.userId !== user.id) {
      throw new ApiError(403, "Not authorized to update this todo");
    }

    // Proceed with the update
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: parsedData.completed},
    });

    return NextResponse.json(
      {
        message: `Task has been marked ${parsedData.completed?"Completed":"Incompleted"}`,
        success: true,
        data: updatedTodo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const responseBody: any = {
      success: false,
      message: error.message,
    };
    if (error instanceof z.ZodError) {
      responseBody.message = "Validation Error";
      responseBody.errors = error.errors.map((e) => e.message);
    }

    return NextResponse.json(responseBody, {
      status: error.statusCode || 500,
    });
  }
}



