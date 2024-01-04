import { Heading, Text } from '@ignite-ui/react'
import Head from 'next/head'
import Image from 'next/image'
import previewImage from '../../assets/app-preview.png'
import { ClaimUsernameForm } from './components/ClaimUsernameForm'
import { Container, Hero, Preview } from './styles'

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Ignite Call</title>
      </Head>
      <Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="lg">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>
      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Ignite Call"
        />
      </Preview>
    </Container>
  )
}
