"use client"; // not needed ig

import * as z from "zod";
import axios from "axios";
import Heading from "@/components/heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { ChatCompletionRequestMessage } from "openai";
import OpenAI from "openai";

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    OpenAI.Chat.CreateChatCompletionRequestMessage[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error: any) {
      //TODO: open pro model
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/15"
      ></Heading>
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
               
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Lets chat with Genius AI ..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                className=" col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        {/* <div className="space-y-4 mt-4 px-7 text-start">
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div key={message.content}>{message.content}</div>
            ))}
          </div>
        </div> */}

        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {
                typeof message.content === "string" ? (
                  <div>{message.content}</div>
                ) : message.content instanceof Array ? (
                  // Render array of ChatCompletionContentPart
                  // <div>
                  //   {message.content.map((part, partIndex) => (
                  //     <span key={partIndex}>{part.text}</span>
                  //   ))}
                  // </div>
                  <div>{}</div>
                ) : null /* Handle other content types as needed */
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
