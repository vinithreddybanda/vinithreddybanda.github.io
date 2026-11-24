import { readFileSync, existsSync } from "node:fs";
const html=readFileSync("index.html","utf8");
const css=readFileSync("style.css","utf8");
const js=readFileSync("app.js","utf8");
const checks=[
  ["portfolio title",html.includes("Vinith Reddy")],
  ["five detailed project entries",(html.match(/class="work-item"/g)||[]).length===5],
  ["fragment animation scene",html.includes('id="fragment-visual"')],
  ["project details and links",html.includes("SimpMusic")&&html.includes("LiveVoiceX")&&html.includes("JournalAI")],
  ["about and education",html.includes("Chaitanya Bharathi Institute of Technology")],
  ["contact section",html.includes('id="contact"')],
  ["responsive stylesheet",css.includes("@media(max-width:640px)")],
  ["reduced-motion support",css.includes("prefers-reduced-motion:reduce")],
  ["scroll choreography",js.includes("ScrollTrigger")&&js.includes("pin:")],
  ["accessible project toggles",html.includes('aria-expanded="false"')],
  ["fallback interaction",js.includes("motion-fallback")]
];
let failed=false;
for(const [label,ok] of checks){console.log((ok?"PASS ":"FAIL ")+label);if(!ok)failed=true;}
for(const path of ["index.html","style.css","app.js","favicon.svg"]){if(!existsSync(path)){console.error("FAIL missing "+path);failed=true;}}
if(failed)process.exit(1);
