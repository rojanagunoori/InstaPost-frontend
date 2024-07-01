import React, { useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import HeroSection from '../../components/heroSection/HeroSection'
import PostPostCard from '../../components/postPostCard/PostPostCard'
import Footer from '../../components/footer/Footer'

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
}, [])
  return (
    <>
    <Layout>
      <HeroSection/>
      <PostPostCard/>
      
    </Layout>
    </>
  )
}

export default Home