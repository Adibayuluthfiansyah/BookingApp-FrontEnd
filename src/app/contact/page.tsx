'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Building2, CheckCircle, ExternalLink, Instagram, Facebook, Twitter } from 'lucide-react';
import Footer from '../utilities/footer/page';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button'; 

const ContactPage = () => {

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Bisnis',
      value: 'O7Ongcorp@gmail.com',
      description: 'Untuk kerja sama dan partnership',
      action: 'mailto:O7Ongcorpz@gmail.com'
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
      value: 'Pontianak',
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
  ];

  const socialLinks = [
    { icon: Instagram, name: 'Instagram', url: '#', handle: '@O7OngCorp' },
    { icon: Facebook, name: 'Facebook', url: '#', handle: 'O7ONG CORP' },
    { icon: Twitter, name: 'Twitter', url: '#', handle: '@O7OngCorp' }
  ];

  const partnershipBenefits = [
    'Akses ke ribuan pengguna aktif',
    'Sistem booking digital terintegrasi',
    'Marketing support untuk venue partners',
    'Analytics dan reporting real-time',
    'Technical support 24/7',
    'Revenue sharing yang kompetitif'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/kontakpage.jpg"
            fill
            priority
            alt="Contact image"
            className="object-cover w-full h-full"
            onError={(e) => { e.currentTarget.src = `https://placehold.co/1920x400/111827/ffffff?text=Hubungi+Kami`; }}
          />
        </div>
        <div className="absolute inset-0 bg-black/60 "></div> 
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Hubungi Kami</h1>
            <p className="text-lg md:text-xl text-gray-200">
              Mari berkolaborasi untuk mengembangkan ekosistem olahraga Indonesia.
            </p>
          </div>
        </div>
      </div>
      
      {/* Konten Utama */}
      <div className="container mx-auto py-12 md:py-20 px-4">
        
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <Card key={index} className="border-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  {info.action && (
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <a
                        href={info.action}
                        target={info.action.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        aria-label={`Buka ${info.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                  <p className="text-primary font-medium mb-1">{info.value}</p>
                  <p className="text-muted-foreground text-sm">{info.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Kolom untuk Partnership */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          <div className="space-y-8">
            <div className="relative rounded-xl shadow-lg overflow-hidden aspect-video lg:aspect-[4/3]">
              <Image
                src="/about.jpg"
                fill
                alt="Business partnership"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/650x400/111827/ffffff?text=Partnership`; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white p-4">
                <h3 className="text-2xl font-bold mb-2">Peluang Partnership</h3>
                <p className="text-white/90">Bergabunglah dengan ekosistem kami.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  Bisnis & Kerja Sama
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Kami membuka peluang kerja sama yang saling menguntungkan untuk memajukan industri
                  olahraga Indonesia. Dari pemilik lapangan hingga sponsor, mari berkontribusi bersama.
                </p>
              </div>
              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">Follow Kami:</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        className="flex items-center gap-3 bg-muted/50 hover:bg-accent px-4 py-3 rounded-lg transition-colors border border-border"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <div className="text-sm">
                          <div className="font-medium text-foreground">{social.name}</div>
                          <div className="text-muted-foreground">{social.handle}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Keuntungan & CTA */}
          <Card className="border-border shadow-sm rounded-xl p-6 md:p-8 lg:sticky lg:top-24">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center text-foreground">
              Siap Memulai Partnership?
            </h3>
            <p className="text-muted-foreground mb-8 text-center max-w-lg mx-auto">
              Bergabunglah dengan puluhan mitra yang telah merasakan manfaat ekosistem kami.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="https://wa.me/6284313546846" target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <a href="mailto:kashmirsoccer@gmail.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Kirim Email
                </a>
              </Button>
            </div>
            
            {/* Partnership Benefits */}
            <div className="mt-12 pt-8 border-t border-border">
              <h4 className="text-xl font-semibold text-foreground mb-6">Keuntungan Bermitra dengan Kami:</h4>
              <div className="space-y-4">
                {partnershipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;