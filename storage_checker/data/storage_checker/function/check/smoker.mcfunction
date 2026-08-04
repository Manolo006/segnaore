# ============================================
# Check Smoker for items (all 3 slots)
# ============================================

# Skip if a display marker already exists near this block (display is at ~ ~1 ~)
execute if entity @e[type=minecraft:text_display,tag=sd.marker,distance=..1.5] run return 0

# Get the number of occupied item slots in the smoker
execute store result score #count sd.var run data get block ~ ~ ~ Items

# If no items, skip
execute unless score #count sd.var matches 1.. run return 0

# Store count and type into storage sd:data for display macro
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
data modify storage sd:data type set value "Smoker"

# Extract ALL item IDs into the items list (use append from so all items are collected)
data modify storage sd:data items set value []
data modify storage sd:data items append from block ~ ~ ~ Items[].id

# Summon the text display
function storage_checker:display/summon with storage sd:data
