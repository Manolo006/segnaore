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

# Initialize item0..item4 to empty strings
data modify storage sd:data item0 set value ""
data modify storage sd:data item1 set value ""
data modify storage sd:data item2 set value ""
data modify storage sd:data item3 set value ""
data modify storage sd:data item4 set value ""

# Populate item lines for occupied slots (smoker uses slots 0, 1, 2)
execute if data block ~ ~ ~ Items[{Slot:0b}] run function storage_checker:check/set_item_0
execute if data block ~ ~ ~ Items[{Slot:1b}] run function storage_checker:check/set_item_1
execute if data block ~ ~ ~ Items[{Slot:2b}] run function storage_checker:check/set_item_2

# Summon the text display
function storage_checker:display/summon with storage sd:data
