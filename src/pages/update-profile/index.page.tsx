import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../../lib/axios'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { Container, Header } from '../register/styles'
import { FormAnnotation, ProfileBox } from './styles'

const updateProfileSchema = z.object({
  bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  })

  const router = useRouter()
  const { data: session } = useSession()

  async function handleUpdateProfile(data: UpdateProfileData) {
    try {
      await api.put('/users/profile', { bio: data.bio })
      await router.push(`/schedule/${session?.user.username}`)
    } catch (error) {}
  }

  return (
    <Container>
      <Head>
        <title>Ignite Call</title>
      </Head>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>Por último, uma breve descrição e uma foto de perfil.</Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size="sm">Foto de perfil</Text>
          <Avatar src={session?.user.avatar_url} alt={session?.user.name} />
        </label>

        <label>
          <Text size="sm">Sobre você</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation size="sm">
            Fale um pouco sobre você. Isto será exibido em sua página pessoal.
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const authOptions = buildNextAuthOptions(req, res)
  const session = await getServerSession(req, res, authOptions)

  return {
    props: {
      session,
    },
  }
}
