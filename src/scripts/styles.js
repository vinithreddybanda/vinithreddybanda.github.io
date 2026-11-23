const response = await fetch("/storybook.css.gz", { cache: "force-cache" });
if (!response.ok || !response.body) throw new Error("The storybook stylesheet could not be loaded.");
const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
const css = await new Response(stream).text();
const style = document.createElement("style");
style.dataset.storybook = "true";
style.textContent = css;
document.head.append(style);
