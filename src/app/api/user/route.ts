import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { updateThemeSchema } from "@/schemas/user.schema";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsedData = updateThemeSchema.parse(body);

    const user=await requireAuth();
    await prisma.user.update({
        where: { id: user.id },
        data: { theme:parsedData.theme},
      });
    return NextResponse.json(
          {
            message: "Theme applied successfully",
            success: true,
          },
          { status: 201 }
        );  
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0].message;
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
  }
}