# ============================================
# Check Hopper for items (excluding minecraft:blaze_rod)
# ============================================

# Skip if a display marker already exists near this block (display is at ~ ~1 ~)
execute positioned ~0.5 ~1 ~0.5 if entity @e[type=minecraft:text_display,tag=sd.marker,distance=..0.4] run return 0

# Copy Items and strip blaze_rod
data modify storage sd:data items_check set from block ~ ~ ~ Items
data remove storage sd:data items_check[{id:"minecraft:blaze_rod"}]

# If no non-blaze-rod items, skip
execute unless data storage sd:data items_check[0] run return 0

# Get number of non-blaze-rod items
execute store result score #count sd.var run data get storage sd:data items_check

# Store count and type into storage sd:data for display macro
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
data modify storage sd:data type set value "Hopper"

# Initialize item0..item4 to empty strings
data modify storage sd:data item0 set value ""
data modify storage sd:data item1 set value ""
data modify storage sd:data item2 set value ""
data modify storage sd:data item3 set value ""
data modify storage sd:data item4 set value ""

# Populate item lines for occupied non-blaze-rod slots
execute if data storage sd:data items_check[0] run function storage_checker:check/set_check_item_0
execute if data storage sd:data items_check[1] run function storage_checker:check/set_check_item_1
execute if data storage sd:data items_check[2] run function storage_checker:check/set_check_item_2
execute if data storage sd:data items_check[3] run function storage_checker:check/set_check_item_3
execute if data storage sd:data items_check[4] run function storage_checker:check/set_check_item_4

# Summon the text display
execute positioned ~0.5 ~1 ~0.5 run function storage_checker:display/summon with storage sd:data
