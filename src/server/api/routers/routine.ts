import {z} from "zod";
import {createTRPCRouter, protectedProcedure,} from "@src/server/api/trpc";
import {Apparatus, ElementType} from "@src/elements/types";
import {env} from "@src/env.mjs";
import {DVRoutine2DBRoutine, Routine2DBRoutine,} from "@src/utils/RoutineMapper";

export type DBRoutine = string;

type MiddleLayerDBRoutine = {
  id: string;
  routine: { group: string; elementNr: string }[];
};

export const routineRouter = createTRPCRouter({
  savePommelHorseRoutine: protectedProcedure
    .input(
      z.object({
        routine: z
          .object({
            name: z.string(),
            explanation: z.string(),
            group: z.string(),
            group_name: z.string(),
            element_alphabetic_value: z.string(),
            element_numeric_value: z.number(),
            page_nr: z.number(),
            row: z.number(),
            col: z.number(),
            img: z.string(),
            elementNr: z.number(),
          })
          .array(),
        dScore: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) {
        console.log("User not found!", {});
        return;
      }

      if (user.email !== env.ADMIN_EMAIL) {
        console.log("Unauthorized user", {});
        return;
      }

      await ctx.prisma.routine.create({
        data: {
          userId: user.id,
          dScore: input.dScore ?? "4.9",
          apparatus: Apparatus.pommel_horse,
          routine: Routine2DBRoutine(input.routine as unknown as ElementType[]),
        },
      });
    }),
  getRoutines: protectedProcedure.query(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user) {
      console.log("User not found!", {});
      return;
    }

    if (user.email !== env.ADMIN_EMAIL) {
      console.log("Unauthorized user", {});
      return;
    }

    const dbRoutines = await ctx.prisma.routine.findMany({
      where: {
        userId: user.id,
      },
    });

    return DVRoutine2DBRoutine(dbRoutines);
  }),
});
