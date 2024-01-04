import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormAnnotation } from './style'

const FormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa de no mínimo 3 caracteres.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Somente letras e hifen' })
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof FormSchema>

export function ClaimUsernameForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(FormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          crossOrigin=""
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>

      <FormAnnotation>
        <Text size="sm">
          {errors.username ? errors.username.message : 'Digite o nome de usuário'}
        </Text>
      </FormAnnotation>
    </>
  )
}
