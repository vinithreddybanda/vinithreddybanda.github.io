import React,{useEffect,useState}from'react'
import{AnimatePresence,motion}from'framer-motion'

const KEY='vinith-wall-v5'

export function MessageWall(){
 const[messages,setMessages]=useState(()=>{
  try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}
 })
 const[name,setName]=useState('')
 const[text,setText]=useState('')
 const[selected,setSelected]=useState(null)

 useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(messages))},[messages])

 const submit=e=>{
  e.preventDefault()
  if(!name.trim()||!text.trim())return
  setMessages(v=>[
   {id:crypto.randomUUID?.()||String(Date.now()),name:name.trim(),text:text.trim(),time:Date.now(),likes:0},
   ...v
  ].slice(0,60))
  setName('')
  setText('')
 }

 const like=id=>{
  setMessages(v=>v.map(x=>x.id===id?{...x,likes:x.likes+1}:x))
 }

 return <div className="message-layout">
  <div className="glass message-form">
   <span className="mono">LEAVE A SIGNAL</span>
   <h3>Tell your friend you’re here.</h3>
   <p>Drop a note, a hello, a thought.</p>
   <form onSubmit={submit}>
    <input value={name} onChange={e=>setName(e.target.value)} maxLength={32} placeholder="Your name" required/>
    <textarea value={text} onChange={e=>setText(e.target.value)} maxLength={500} placeholder="What do you want to say?" required/>
    <button className="pill solid" type="submit">Post message ↗</button>
   </form>
  </div>

  <div className="glass message-list">
   {messages.length?messages.map(m=>
    <motion.article layout key={m.id} className="message">
     <div className="message-top">
      <b>{m.name}</b>
      <span>{new Date(m.time).toLocaleDateString()}</span>
     </div>
     <p>{m.text}</p>
     <div className="message-actions">
      <motion.button type="button" whileTap={{scale:.86}} whileHover={{y:-1}} onClick={()=>like(m.id)}>♡ {m.likes}</motion.button>
      <motion.button type="button" whileTap={{scale:.96}} whileHover={{x:2}} onClick={()=>setSelected(m)}>Read ↗</motion.button>
     </div>
    </motion.article>
   ):<div className="empty">No messages yet.</div>}
  </div>

  <AnimatePresence>
   {selected&&
    <motion.div className="modal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}>
     <motion.div className="modal-inner glass" initial={{y:22,scale:.97}} animate={{y:0,scale:1}} exit={{y:16,scale:.985}} onClick={e=>e.stopPropagation()}>
      <button className="close" type="button" onClick={()=>setSelected(null}>×</button>
      <span className="mono">MESSAGE</span>
      <h3>{selected.name}</h3>
      <time>{new Date(selected.time).toLocaleString()}</time>
      <p>{selected.text}</p>
     </motion.div>
    </motion.div>
   }
  </AnimatePresence>
 </div>
}
