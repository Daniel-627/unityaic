import React from 'react'
import Link from 'next/link'
import { FiCheckCircle } from 'react-icons/fi'

export default function AboutPage() {
  return (
    <div className="mt-40 py-16 px-8 bg-gray-50">

      {/* Introduction */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">
          Work of the Church
        </p>
        <h2 className="text-4xl font-bold text-primary">
          We Preach the Gospel in Every Service
        </h2>
        <p className="text-lg text-muted mt-4">
          At Unity AIC we are committed to the faithful preaching of Scripture —
          expository, Christ-centred, and practically applied to everyday life.
          Every sermon is an encounter with the living Word.
        </p>
        <p className="text-lg text-muted mt-4">
          Whether you are new to faith or have walked with God for years, you will find
          a home here. We are a multigenerational congregation rooted in the Africa Inland
          Church Kenya — a denomination built on the Word and sustained by prayer.
        </p>
        <p className="text-lg text-muted mt-4">
          From Sunday worship to midweek Bible study, from Youth ministry to Women's
          Fellowship, every programme at Unity AIC exists to help you grow deeper in your
          faith and stronger in your relationships.
        </p>
        <p className="text-lg text-muted mt-4">
          We don't just invite you to attend — we invite you to belong. Come as you are,
          and grow into who God is calling you to be.
        </p>
        
      </div>

      {/* Pillars grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {/* Worship */}
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-4">Worship</h3>
          {[
            'Sunday services at 8:00 AM and 10:30 AM',
            'Spirit-led, Scripture-centred preaching',
            'Congregational singing and corporate prayer',
            'Special services on Easter, Christmas, and national days',
          ].map((item, i) => (
            <div key={i} className="flex items-start p-4 mb-4">
              <FiCheckCircle className="text-accent mr-2 mt-1 shrink-0" size={18} />
              <p className="text-base text-gray-800">{item}</p>
            </div>
          ))}
        </div>

        {/* Word */}
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-4">Word</h3>
          {[
            'Expository preaching through books of the Bible',
            'Wednesday evening Bible study',
            'Small group discipleship within ministries',
            'Scripture memory and devotional resources',
          ].map((item, i) => (
            <div key={i} className="flex items-start p-4 mb-4">
              <FiCheckCircle className="text-accent mr-2 mt-1 shrink-0" size={18} />
              <p className="text-base text-gray-800">{item}</p>
            </div>
          ))}
        </div>

        {/* Community */}
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-4">Community</h3>
          {[
            'Youth ministry — JOY (Jesus Our Youth)',
            "Women's Fellowship with AGMs and welfare",
            "Men's Fellowship and leadership programmes",
            'Sunday School and Cadet / Star for children',
          ].map((item, i) => (
            <div key={i} className="flex items-start p-4 mb-4">
              <FiCheckCircle className="text-accent mr-2 mt-1 shrink-0" size={18} />
              <p className="text-base text-gray-800">{item}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}