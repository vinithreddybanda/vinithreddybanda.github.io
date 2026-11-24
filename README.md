# Morrowvale

A 3D island exploration game for the browser. Walk the Old Quarter, cross Bluebell Meadow, follow the Saltwind Harbour coast, explore the Whispering Woods, climb Cloudrest Highlands and uncover the Sunken Observatory.

## Play

Open the GitHub Pages site. The first load downloads the locally hosted GLB world assets.

- **W / A / S / D** or arrow keys: walk
- **Shift:** hurry
- **E:** talk, gather, or interact
- **Mouse drag:** orbit the third-person camera
- **M:** map
- **J:** field journal
- **Escape:** pause
- **Touch:** virtual movement stick and interact button; drag the world to look around

The island includes six distinct regions, named residents, six multi-step storylines, a keepsake trail, character choices, a journal, inventory, a region map, and automatic local saves.

## Technical structure

- game.js: browser entry point
- src/game.js: player controller, camera, interactions, quest progression, journal, map, wardrobe and local save system
- src/world.js: terrain mesh, water, paths, landmarks, GLB model loading, NPC placement, pickups and ambient animation
- src/data.js: region, resident, quest, pickup and keepsake definitions
- assets/models/: self-hosted GLB environment, character and animal assets

The game uses Three.js (MIT) and Kenney 3D models (CC0 1.0). The model library is credited in CREDITS.md.

This is a single-player static-hosted game. Multiplayer is not implemented.
