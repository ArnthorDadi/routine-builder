import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@src/server/api/trpc";

export const routineRouter = createTRPCRouter({
  postPommelHorseRoutine: protectedProcedure
    .input(z.object({ routine: z.any().array() }))
    .mutation(({ ctx, input }) => {
      console.log("", { input });
      return "you can now see this secret message!";
    }),
});
