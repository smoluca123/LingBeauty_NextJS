import { z } from "zod";

const formSchema = z.object({
  sortOrder: z.coerce.number().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;
let x: FormValues = { sortOrder: 1, isActive: true };
console.log(x);

