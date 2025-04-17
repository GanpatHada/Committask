import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/schemas/user.schema";
import { hashPassword } from "@/services/hashing";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(parsedData.password);

    const newUser = await prisma.user.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        password: hashedPassword,
      } as Prisma.UserCreateInput,
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser.id },
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
