import { getServerSession } from "next-auth";

import prisma from "./prisma";
import ApiError from "./errors/apiError";
import { authOptions } from "./auth";


export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new ApiError(401, "Unauthorized access",["user is not authorized or token missing"]);
  }

  const userId=session.user.id;

  const existingUser = await prisma.user.findUnique({
    where: {
      id:userId,
    },
  });
  if (!existingUser) {
   throw new ApiError(401, "User not found" ,["user either deleted or not available"])
  }

  return existingUser;
}
