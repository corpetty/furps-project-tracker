This document defines the process from Milestone Definition to FURPS Project Tracker visualization

1. The project leads, with collaboration with Insights team, will define a number of `Milestones` for a given time period.
    -  Each `Milestone` document will be written in markdown, and link to each `FURPS` detailed within it. 
2. The `Milestones` will each detail a number of `FURPS` within them, that "move the needle" of the project towards its "Production" `Stage`.
    -   Each `FURPS` will be written as a markdown document, and link to some `Milestone` document that puts it into context of a larger scope of work.
3. The application will parse through all `Milestone` and `FURPS` documents and record them into a database
    - each db entry will be a `FURPS` item
4. The application will then render the `FURPS` matrix, with each cell displaying the `FURPS` that belong to it.