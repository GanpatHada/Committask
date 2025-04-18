import ApiError from "@/lib/errors/apiError";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { updateTodoSchema } from "@/schemas/task.schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id || id.length === 0)
      throw new ApiError(400, "Todo not found with this id");
    const user = await requireAuth();
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }
    if (existingTodo.userId !== user.id)
      throw new ApiError(404, "Not authorized to delete it", [
        "this is not your todo",
      ]);

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
    console.log(error);
    const responseBody: any = {
      success: false,
      message: error.message,
    };
    if (error.errors && error.errors.length > 0)
      responseBody.errors = error.errors.map(
        (e: { message: string }) => e.message || e
      );
    return NextResponse.json(responseBody, { status: error.statusCode });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id || id.length === 0)
      throw new ApiError(400, "Todo not found with this id");
    let body = await req.text();
    if (!body.trim()) throw new ApiError(400, "Body is missing");
    body = JSON.parse(body);
    const parsedData = updateTodoSchema.parse(body);
    const user = await requireAuth();
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }
    if (existingTodo.userId !== user.id)
      throw new ApiError(404, "Not authorized to delete it", [
        "this is not your todo",
      ]);
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: { ...parsedData, id, userId: user.id },
    });
    return NextResponse.json(
      {
        message: "Task deleted successfully",
        success: true,
        data: updatedTodo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    const responseBody: any = {
      success: false,
      message: error.message,
    };
    if(error instanceof z.ZodError)
        responseBody.message='Validation Error'
    if (error.errors && error.errors.length > 0)
      responseBody.errors = error.errors.map(
        (e: { message: string }) => e.message || e
      );
    return NextResponse.json(responseBody, { status: error.statusCode });
  }
}
