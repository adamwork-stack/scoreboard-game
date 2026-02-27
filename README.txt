DEAL OR NO DEAL SCOREBOARD
==========================

Setup
-----
1. Run a local server (required for image loading):
   - Option A: npx serve . -l 3000
   - Option B: python -m http.server 8000
   
2. Open http://localhost:3000 (or :8000) in your browser.

Asset Folders
-------------
game-assets/
  1/ through 9/   - Each folder holds 10 .jpg files: 01.jpg, 02.jpg ... 10.jpg
  round-over.png  - Overlay shown after NO DEAL (between rounds)
  deal.png        - Overlay shown when player chooses DEAL (game ends)
  sounds/
    no-deal.mp3   - Sound for NO DEAL (optional)
    deal.mp3      - Sound for DEAL (optional)

Controls
--------
- Click a card     - Eliminate it (flip to back, out of play)
- Space            - NO DEAL (continue to next round)
- Space (again)    - Dismiss round overlay, start next round
- D                - DEAL (end game)
- Z                - Reset game anytime

Rounds
------
Round 1: 3 cases to eliminate
Round 2: 2 cases
Round 3: 2 cases  
Round 4: 1 case
