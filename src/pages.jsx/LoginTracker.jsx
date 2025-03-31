
import { Button, Field, Input, Stack } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

const Demo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit((data) => console.log(data))

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="4" align="flex-start" maxW="sm">
        <Field.Root invalid={!!errors.firstName}>
          <Field.Label>First name</Field.Label>
          <Input {...register("firstName")} />
          <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.lastName}>
          <Field.Label>Last name</Field.Label>
          <Input {...register("lastName")} />
          <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit">Submit</Button>
      </Stack>
    </form>
  )
}

export default Demo
