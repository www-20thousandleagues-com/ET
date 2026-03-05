---
name: form-builder
description: Build a complete form with validation, error handling, and submission
argument-hint: <form-name> <fields...> (e.g., "ContactForm name:string email:email message:textarea")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Form Builder

Create: $ARGUMENTS

## Stack
- `react-hook-form` for form state management
- Zod for schema validation (install if needed)
- shadcn/ui form components (`Input`, `Label`, `Button`, `Select`, etc.)

## Generated Structure
```tsx
// Schema with Zod validation
const formSchema = z.object({ ... })

// Form component using react-hook-form + shadcn/ui
export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ... }
  })

  async function onSubmit(values) { ... }

  return <Form {...form}>...</Form>
}
```

## Included Features
- Client-side validation with error messages
- Loading state during submission
- Success/error toast notifications (sonner)
- Accessible labels and error announcements
- Keyboard navigation (Tab, Enter to submit)
- Reset form after successful submission
- Responsive layout (stack on mobile, grid on desktop)
- Dark mode support
