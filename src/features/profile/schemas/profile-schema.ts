import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(60, "الاسم طويل جداً"),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
