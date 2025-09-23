import React from 'react'
import Image from 'next/image'
import { Eye, Target } from 'lucide-react'
import Footer from '../utilities/footer/page'

const AboutPage = () => {
  return (
    //Hero Section
    <div className='min-h-screen'>
        <div className='relative h-80 md:h-96 overflow-hidden'>
        <div className='absolute inset-0'>
            <Image src='/about1.jpg' width={650} height={579} alt="about image"
            className='object-cover w-full h-full'/>
        </div>
        <div className='absolute inset-0 bg-black/50'></div>
        <div className='relative z-10 flex items-center justify-center h-full text-center text-white'>
          <div>
            <h1 className='text-4xl md:text-6xl font-bold mb-4'>Tentang Kami</h1>
            <p className='text-lg md:text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus, aliquid!</p>
          </div>
        </div>
        </div>

        {/* Main Image */}
        <div className='max-w-screen-xl mx-auto py-16 px-4'>
            <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='order-2 md:order-1'>
                <Image 
                src='/about.jpg' 
                width={650} 
                height={579} 
                alt="about image"
                className='rounded-lg shadow-lg w-full h-auto'
            />
            </div>

             {/* Content */}
          <div className='order-1 md:order-2 space-y-8'>
            <div>
              <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-6'>
                Who We Are
              </h2>
              <p className='text-gray-600 leading-relaxed mb-6'>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo rerum voluptate ab, 
                quae ducimus consequuntur sunt vel dolor esse similique! Et perspiciatis libero 
                distinctio accusantium cupiditate tempora voluptate.
              </p>
            </div>

            {/* Vision */}
            <div className='flex items-start space-x-4'>
              <div className='flex-shrink-0 w-9 h-8 rounded-full flex items-center justify-center mt-1'>
                <Eye/>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>Visi :</h3>
                <p className='text-gray-600 leading-relaxed'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, hic quod harum in 
                  corporis eum.
                </p>
              </div>
            </div>

                {/* Misi */}
            <div className='flex items-start space-x-4'>
              <div className='flex-shrink-0 w-9 h-8 rounded-full flex items-center justify-center mt-1'>
                <Target/>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-800 mb-2'>Misi :</h3>
                <p className='text-gray-600 leading-relaxed'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, hic quod harum in 
                  corporis eum.
                </p>
              </div>
            </div>
        </div>
        </div>
        </div>
        <Footer/>
    </div>
)
}

export default AboutPage