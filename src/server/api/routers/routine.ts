import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@src/server/api/trpc";
import { Apparatus } from "@src/elements/types";
import { env } from "@src/env.mjs";

export const routineRouter = createTRPCRouter({
  savePommelHorseRoutine: protectedProcedure
    .input(
      z.object({
        routine: z
          .object({
            group: z.string(),
            elementNr: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user || user.email !== env.ADMIN_EMAIL) {
        console.log("User not found!", {});
        return;
      }

      await ctx.prisma.routine.create({
        data: {
          userId: user.id,
          dScore: "4.9",
          apparatus: Apparatus.pommel_horse,
          routine: `[${input.routine.reduce((prev, curr, index) => {
            return `${prev}${!!prev ? ", " : ""}(${curr.group}, ${
              curr.elementNr
            })`;
          }, "")}]`,
        },
      });
      return;
    }),
});
