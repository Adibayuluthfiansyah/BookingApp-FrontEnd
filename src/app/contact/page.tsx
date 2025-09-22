'use client'

import React from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Clock, Building2,CheckCircle,ExternalLink,Instagram,Facebook,Twitter
} from 'lucide-react'
import Footer from '../utilities/footer/page'

const ContactPage = () => {

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Bisnis',
      value: 'kashmirsoccer@gmail.com',
      description: 'Untuk kerja sama dan partnership',
      action: 'mailto:kashmirsoccer@gmail.com'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+62 843-1354-6846',
      description: 'Response cepat 24/7',
      action: 'https://wa.me/6284313546846'
    },
    {
      icon: MapPin,
      title: 'Lokasi Kantor',
      value: 'Jakarta Selatan',
      description: 'Kunjungi kantor kami',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      value: '08:00 - 22:00 WIB',
      description: 'Senin - Minggu',
      action: null
    }
  ]


  const socialLinks = [
    { icon: Instagram, name: 'Instagram', url: '#', handle: '@kashmirsoccer' },
    { icon: Facebook, name: 'Facebook', url: '#', handle: 'Kashmir Soccer' },
    { icon: Twitter, name: 'Twitter', url: '#', handle: '@kashmirsoccer' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="/kontakpage.jpg" 
            width={1920} 
            height={1080} 
            alt="Contact image"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Mari berkolaborasi untuk mengembangkan ekosistem olahraga Indonesia
            </p>
          </div>
        </div>
      </div>
      

      <div className="max-w-7xl mx-auto py-16 px-4">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {info.action && (
                    <a 
                      href={info.action}
                      className="text-blue-600 hover:text-blue-700"
                      target={info.action.startsWith('http') ? '_blank' : '_self'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{info.value}</p>
                <p className="text-gray-600 text-sm">{info.description}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Business Partnership Section */}
          <div className="space-y-8">
            <div className="relative">
              <Image 
                src="/about.jpg" 
                width={650} 
                height={400} 
                alt="Business partnership"
                className="rounded-xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Partnership Opportunities</h3>
                <p className="text-white/90">Bergabunglah dengan ekosistem Kashmir Soccer</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8" />
                  Bisnis & Kerja Sama
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Kami membuka peluang kerja sama yang saling menguntungkan untuk memajukan industri 
                  olahraga Indonesia. Dari pemilik lapangan hingga sponsor, mari berkontribusi bersama.
                </p>
              </div>
               {/* Social Media */}
              <div className="pt-3">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Follow Kami:</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.url}
                        className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">{social.name}</div>
                          <div className="text-gray-600">{social.handle}</div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

        {/* Call to Action */}
        <div className="rounded-2xl p-5 text-center text-black">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Siap Memulai Partnership?
          </h3>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan puluhan mitra yang telah merasakan manfaat ekosistem Kashmir Soccer
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://wa.me/6284313546846" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Hubungi WhatsApp
            </a>
            <a 
              href="mailto:kashmirsoccer@gmail.com" 
              className="bg-black backdrop-blur-sm hover:bg-black/50 px-8 py-3 rounded-full font-semibold  text-white transition-colors border border-white/30 inline-flex items-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Kirim Email
            </a>
          </div>
          

            {/* Partnership Benefits */}
              <div className="grid gap-4 mt-16">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Keuntungan Bermitra dengan Kami:</h4>
                {[
                  'Akses ke ribuan pengguna aktif',
                  'Sistem booking digital terintegrasi',
                  'Marketing support untuk venue partners',
                  'Analytics dan reporting real-time',
                  'Technical support 24/7',
                  'Revenue sharing yang kompetitif'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

        </div>
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default ContactPage