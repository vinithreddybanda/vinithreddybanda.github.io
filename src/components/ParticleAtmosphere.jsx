import React,{useMemo}from'react'

export function ParticleAtmosphere(){
 const particles=useMemo(()=>Array.from({length:90},(_,i)=>({
  id:i,
  left:(i*37.17)%100,
  top:(i*61.73)%100,
  size:1.5+((i*13)%9)/2,
  delay:-((i*0.73)%12),
  duration:10+((i*17)%16),
  drift:8+((i*11)%22),
  opacity:.28+((i*7)%48)/100,
  warm:i%3
 })),[])
 return <div className="particle-atmosphere" aria-hidden="true">
  <div className="particle-haze particle-haze-a"/>
  <div className="particle-haze particle-haze-b"/>
  {particles.map(p=><i key={p.id} className={`glitter-particle warm-${p.warm}`} style={{left:p.left+'%',top:p.top+'%',width:p.size+'px',height:p.size+'px',animationDelay:p.delay+'s',animationDuration:p.duration+'s','--drift':p.drift+'px','--opacity':p.opacity}}/>)}
 </div>
}
