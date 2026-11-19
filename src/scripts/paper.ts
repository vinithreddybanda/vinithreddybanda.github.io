const canvas=document.querySelector<HTMLCanvasElement>("[data-paper-canvas]");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
if(canvas){const gl=canvas.getContext("webgl",{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:"low-power"});
if(gl){
const vertexSource="attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}";
const fragmentSource=[
"precision highp float;uniform vec2 u_resolution;uniform vec2 u_mouse;uniform float u_time;",
"float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
"float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}",
"float fbm(vec2 p){float v=0.0;float a=0.5;mat2 r=mat2(0.82,-0.57,0.57,0.82);for(int i=0;i<5;i++){v+=a*noise(p);p=r*p*2.03+17.1;a*=0.5;}return v;}",
"void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy;vec2 p=(uv-0.5)*vec2(u_resolution.x/u_resolution.y,1.0);float t=u_time*0.012;",
"float ca=fbm(p*2.15+vec2(t,-t*0.62));float cb=fbm(p*5.8-vec2(t*0.55,t*0.31));float cloud=ca*0.72+cb*0.28;",
"float grain=hash(gl_FragCoord.xy)-0.5;float fibre=noise(vec2(p.x*46.0+ca*3.0,p.y*310.0));",
"vec3 deep=vec3(0.026,0.027,0.025);vec3 stock=vec3(0.078,0.075,0.066);vec3 tone=mix(deep,stock,smoothstep(0.20,0.82,cloud)*0.66);",
"float vignette=smoothstep(1.08,0.12,length(p*vec2(0.82,1.12)));tone*=0.78+vignette*0.22;",
"vec2 mouse=(u_mouse-0.5)*vec2(u_resolution.x/u_resolution.y,1.0);float shade=exp(-length(p-mouse)*3.1)*0.022;",
"tone+=vec3(shade*0.95,shade*0.88,shade*0.72);tone+=(grain*0.026)+((fibre-0.5)*0.018);gl_FragColor=vec4(max(tone,0.0),1.0);}"
].join("\n");
const compile=(type:number,source:string)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;};
const vs=compile(gl.VERTEX_SHADER,vertexSource);const fs=compile(gl.FRAGMENT_SHADER,fragmentSource);const program=gl.createProgram();
if(vs&&fs&&program){gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
if(gl.getProgramParameter(program,gl.LINK_STATUS)){gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const pos=gl.getAttribLocation(program,"a_position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
const res=gl.getUniformLocation(program,"u_resolution"),mouseLoc=gl.getUniformLocation(program,"u_mouse"),timeLoc=gl.getUniformLocation(program,"u_time");
let width=1,height=1,mx=.5,my=.5,frame=0,last=0,time=0,visible=document.visibilityState==="visible";
const draw=()=>{gl.useProgram(program);gl.uniform2f(res,width,height);gl.uniform2f(mouseLoc,mx,my);gl.uniform1f(timeLoc,time);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);};
const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.25);width=Math.max(1,Math.floor(innerWidth*dpr));height=Math.max(1,Math.floor(innerHeight*dpr));canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);draw();};
const tick=(now:number)=>{frame=0;if(!visible||reduceMotion.matches)return;if(now-last<40){frame=requestAnimationFrame(tick);return;}time+=Math.min((now-(last||now))/1000,.08);last=now;draw();frame=requestAnimationFrame(tick);};
const wake=()=>{if(frame||!visible||reduceMotion.matches)return;last=0;frame=requestAnimationFrame(tick);};
window.addEventListener("resize",resize,{passive:true});window.addEventListener("pointermove",(e)=>{mx=e.clientX/Math.max(1,innerWidth);my=1-e.clientY/Math.max(1,innerHeight);wake();},{passive:true});
document.addEventListener("visibilitychange",()=>{visible=document.visibilityState==="visible";if(!visible&&frame){cancelAnimationFrame(frame);frame=0;}else wake();});
reduceMotion.addEventListener("change",()=>{if(reduceMotion.matches&&frame){cancelAnimationFrame(frame);frame=0;draw();}else wake();});resize();if(!reduceMotion.matches)wake();
}}}}