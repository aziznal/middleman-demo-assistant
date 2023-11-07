"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Eye, Loader } from "lucide-react";
import { z } from "zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const supabase = createClientComponentClient();

  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formValues: LoginForm) => {
    setHasSubmitted(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formValues.email,
        password: formValues.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
    }

    setHasSubmitted(false);
  };

  return (
    <div className="flex flex-col mx-auto lg:w-[400px] gap-4 mt-12 px-4">
      <h1 className="text-4xl">Login</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input placeholder="john@gmail.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={showPassword ? "password" : "********"}
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />

                    <Eye
                      className="text-slate-400 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            {!hasSubmitted && <Button type="submit">Login</Button>}
            {hasSubmitted && (
              <Button type="button" disabled>
                <span>Login</span>
                <span className="ml-2 animate-spin">
                  <Loader />
                </span>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
