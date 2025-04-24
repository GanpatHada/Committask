import ApiError from "@/lib/errors/apiError";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { updateTodoSchema } from "@/schemas/task.schema";
import { NextApiRequest} from "next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function DELETE(
  req:NextApiRequest,{ params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (!id || Array.isArray(id))
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
    const id = params.id;

    if (!id || Array.isArray(id))
      throw new ApiError(400, "Todo not found with this id");

    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const parsedData = updateTodoSchema.parse(body);
    const user = await requireAuth();

    const existingTodo = await prisma.todo.findUnique({ where: { id } });

    if (!existingTodo) {
      throw new ApiError(404, "Todo not found");
    }

    if (existingTodo.userId !== user.id) {
      throw new ApiError(403, "Not authorized to update this todo");
    }

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

    if (error instanceof z.ZodError) {
      responseBody.message = "Validation Error";
      responseBody.errors = error.errors.map((e) => e.message);
    }

    return NextResponse.json(responseBody, {
      status: error.statusCode || 500,
    });
  }
}