"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "The name is required!")
    .transform((name) =>
      name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0].toUpperCase().concat(word.substring(1)))
        .join(" "),
    ),
  email: z.email("Invalid email!!").toLowerCase(),
  password: z
    .string()
    .min(6, "The password must be at least 6 characters long."),
  techs: z
    .array(
      z.object({
        title: z.string().trim().min(1, "The title is required!"),
        knowledge: z.number().min(1).max(100),
      }),
    )
    .min(2, "Enter at least 2 technologies"),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export default function Home() {
  const [output, setOutput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      techs: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  });

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="container m-4">
        <CardHeader className="font-black text-2xl">Advanced Form</CardHeader>
        <CardDescription className="text-neutral-500 mx-2">Next.js | Typescript | React-Hook-Form | Zod</CardDescription>
        <CardContent>
          <form onSubmit={handleSubmit(createUser)}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" type="text" {...register("name")} />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </Field>
                <Separator />
                <FieldGroup>
                  <div className="flex justify-between">
                    <FieldLegend>
                      <span className="font-semibold text-lg">Technologies</span>
                    </FieldLegend>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        append({ title: "", knowledge: 0 });
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {errors.techs && (
                    <FieldError>
                      {errors.techs.message}
                    </FieldError>
                  )}
                  {fields.map((item, index) => (
                    <Card className="w-full p-4 " key={item.id}>
                      <FieldGroup className="flex flex-row gap-1">
                        <Field>
                          <FieldLabel>Name</FieldLabel>
                          <Input
                            type="text"
                            {...register(`techs.${index}.title`)}
                          />
                          {errors.techs?.[index]?.title && (
                            <FieldError>
                              {errors.techs?.[index]?.title.message}
                            </FieldError>
                          )}
                        </Field>
                        <Field className="min-w-20 w-min">
                          <FieldLabel>Knowledge</FieldLabel>
                          <Input
                            type="number"
                            {...register(`techs.${index}.knowledge`, {
                              valueAsNumber: true,
                            })}
                          />
                          {errors.techs?.[index]?.knowledge && (
                            <FieldError>
                              {errors.techs?.[index]?.knowledge.message}
                            </FieldError>
                          )}
                        </Field>
                      </FieldGroup>
                    </Card>
                  ))}
                </FieldGroup>
                <Separator />
                <Field orientation="horizontal" className="w-full flex justify-center">
                  <Button type="submit" className="w-full max-w-2xl">
                    Submit
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
        <CardFooter>
          <pre>{output}</pre>
        </CardFooter>
      </Card>
    </main>
  );
}
