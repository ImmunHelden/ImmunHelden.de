import React from 'react'
import Layout from '../layouts/layout'
import Header from '../sections/header'
import Partners from '../sections/partners'
import Explanation from '../sections/explanation'
import Locations from '../sections/locations'
import Attributes from '../sections/attributes'
import Form from '../sections/form'
import Faq from '../sections/faq'
import ContactBanner from '../sections/contact-banner'
import Footer from '../sections/footer'
import Team from '../sections/team'
import Experts from '../sections/experts'

export default function Home() {
  return (
    <Layout>
      
      <Header />

      <Partners />

      <Explanation />

      <Locations />

      <Attributes />

      <Form />

      <Experts />

      <Team />

      <Faq />

      <ContactBanner />

      <Footer />

    </Layout>
  )
}
