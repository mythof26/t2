import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, "할 일을 입력해주세요."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTaskModalProps {
  onAdd: (title: string) => void;
}

export function AddTaskModal({ onAdd }: AddTaskModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    onAdd(data.title);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg bg-[#007AFF] hover:bg-[#005bb5] p-0 flex items-center justify-center z-50"
          aria-label="Add Task"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="add-task-description">
        <DialogHeader>
          <DialogTitle>새 할 일 추가</DialogTitle>
          <p id="add-task-description" className="sr-only">새로운 할 일을 입력하고 엔터를 누르세요.</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="할 일을 입력하고 Enter..." 
                      autoFocus
                      autoComplete="off"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end hidden">
              <Button type="submit">추가</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
