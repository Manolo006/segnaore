# ============================================
# Check Hopper for items (all 5 slots, any facing direction)
# ============================================

# Skip if a display marker already exists at this position
execute if entity @e[type=minecraft:text_display,tag=sd.marker,dx=0,dy=0,dz=0] run return 0

# Get the number of occupied item slots in the hopper
execute store result score #count sd.var run data get block ~ ~ ~ Items

# If no items, skip
execute unless score #count sd.var matches 1.. run return 0

# Store count and type for display macro
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
data modify storage sd:data type set value "Hopper"

# Summon the text display
function storage_checker:display/summon with storage sd:data
