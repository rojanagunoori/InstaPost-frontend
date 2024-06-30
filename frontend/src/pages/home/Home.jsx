import React, { useEffect } from 'react'
import Layout from '../../compoents/layout/Layout'
import HeroSection from '../../compoents/heroSection/HeroSection'
import PostPostCard from '../../compoents/postPostCard/PostPostCard'
import Footer from '../../compoents/footer/Footer'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])
  return (
    <Layout>
      <HeroSection/>
      <PostPostCard/>
      
    </Layout>
  )
}

export default Home