import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import "./styles/global.css";

const createUserFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .transform((name) =>
      name
        .trim()
        .split(" ")
        .map((word) =>
          word[0].toUpperCase().concat(word.substring(1).toLowerCase())
        )
        .join(" ")
    ),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .refine(
      (email) => email.endsWith("gmail.com"),
      "Email deve ser do domínio gmail.com"
    ),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const createUser = (data: any) => {
    console.log(data);
  };

  return (
    <main className="h-screen bg-zinc-900 text-zinc-300 flex flex-col gap-12 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="">Nome</label>
          <input
            type="text"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
            {...register("name")}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Email</label>
          <input
            type="email"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
            {...register("email")}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-emerald-600 roudend font-semibold text-white h-10 hover:bg-emerald-800 mt-4"
        >
          Salvar
        </button>
      </form>
    </main>
  );
}

export default App;
