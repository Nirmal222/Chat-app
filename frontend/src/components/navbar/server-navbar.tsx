import dynamic from 'next/dynamic'

const ServerNavbar = () => {
  const ClientNavbar = dynamic(() => import('./index'), {
    ssr: false,
  })

  return <ClientNavbar />
}

export default ServerNavbar