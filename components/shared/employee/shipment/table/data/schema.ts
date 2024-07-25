import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userskSchema = z.object({
  EmployeeID: z.string(),
  FirstName: z.string(),
  LastName: z.string(),
  Gender: z.string(),
  Address: z.string(),
  Phone: z.string(),
  Password: z.string(),
  Role: z.string(),
  IsActive: z.string(),
  FacilityID: z.string(),
})

export type Task = z.infer<typeof userskSchema>
