# Work in Progress...

# StackMakerFE

This Project should step in when it's too socially awkward to decide how to split up 10 league of legends players into 2 teams. You can either split them up evenly or sort by rank. It all takes into consideration which roles you prefer.


## Algo Rules:

- Every player must be assigned exactly 1 role for exactly 1 team
- Teams can only be assigned in viable Flex Queue Team sizes, so 1,2,3 and 5, it should always prefer teams of 5
- Every Player can enter 2 role preferences and should be assigned accordingly
- Every Player can enter his rank 5 The teams should be created to either of these conditions 
- The teams ranks should be distributed as evenly as possible 
- the teams ranks should be split so the higher ranked players are in team 1 and the lower ranked players are in team 2 
- All this rank split up should still prioritize role preference matchmaking over just ordering by rank
- If there is a role that cannot be covered by any preference it needs to be autofilled by someone who is overlapping (take 1 player of overlapping roles at random as autofill)
- If two players have the same main role, the one with the higher rank should have higher priority for it


# Frontend To-Do

- Scrollbar StackCard
- Dark Mode Light Mode (idea)