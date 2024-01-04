import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../lib/axios'
import { Container, Form, FormError, Header } from './styles'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa de no mínimo 3 caracteres.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'Somente letras e hifen' })
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'Informe seu nome completo!' }),
})

type RegisterSchema = z.infer<typeof registerSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username) {
      setValue('username', router.query.username as string)
    }
  }, [router.query?.username, setValue])

  async function handleRegister(data: RegisterSchema) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/connect-calendar')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data.message) {
        alert(error.response.data.message)
        return
      }

      console.log(error)
    }
  }

  return (
    <Container>
      <Head>
        <title>Ignite Call</title>
      </Head>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            crossOrigin=""
            {...register('username')}
          />

          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text>Nome completo</Text>
          <TextInput
            placeholder="Seu nome"
            crossOrigin=""
            {...register('name')}
          />

          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit">
          Próximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
