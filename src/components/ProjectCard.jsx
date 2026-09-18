import React from'react'
import{motion}from'framer-motion'
import{GlassCard}from'./GlassCard'
export function ProjectCard({p,i}){return <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.7,delay:i*.07}}><GlassCard className="project"><span className="mono">{String(i+1).padStart(2,'0')} / {p.meta}</span><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></GlassCard></motion.div>}