import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  technologies: z
    .array(
      z.object({
        title: z.string().min(1, "Título é obrigatório"),
        knowledge: z.coerce
          .number()
          .min(1, "Conhecimento é obrigatório")
          .max(5, "Conhecimento deve ser entre 1 e 5"),
      })
    )
    .min(1, "Deve ter no mínimo uma tecnologia"),
});

type createUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technologies",
  });

  const createUser = (data: any) => {
    setOutput(JSON.stringify(data));
  };

  const addNewTechnology = () => {
    append({ title: "", knowledge: 0 });
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
          {errors.name && (
            <span className="text-red-600">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="">Email</label>
          <input
            type="email"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-600">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className="border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-600">{errors.password.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              className="text-emerald-600 text-sm"
              onClick={addNewTechnology}
            >
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  className="col-span-2 border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
                  {...register(`technologies.${index}.title` as const)}
                />
                <input
                  type="number"
                  className="col-span-1 border border-zinc-500 shadow-sm rounded h-10 px-3 bg-zinc-800"
                  {...register(`technologies.${index}.knowledge` as const)}
                />
              </div>
              <div className="flex flex-col">
                {errors.technologies?.[index]?.title && (
                  <span className="text-red-600">
                    {errors.technologies[index]?.title?.message}
                  </span>
                )}
                {errors.technologies?.[index]?.knowledge && (
                  <span className="text-red-600">
                    {errors.technologies[index]?.knowledge?.message}
                  </span>
                )}
              </div>
            </div>
          ))}
          {errors.technologies && (
            <span className="text-red-600">{errors.technologies.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-600 roudend font-semibold text-white h-10 hover:bg-emerald-800 mt-4"
        >
          Salvar
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}

export default App;
