# ============================================
# Check Hopper for items (all 5 slots)
# Executed at block integer coords (align xyz)
# ============================================

# Position at display location (~0.5 ~1 ~0.5) and check distance <= 0.4
# Using distance=..0.4 prevents matching displays of adjacent containers (which are 1.0+ block away)
execute positioned ~0.5 ~1 ~0.5 if entity @e[type=minecraft:text_display,tag=sd.marker,distance=..0.4] run return 0

# Get the number of occupied item slots in the hopper
execute store result score #count sd.var run data get block ~ ~ ~ Items

# If no items, skip
execute unless score #count sd.var matches 1.. run return 0

# Store count and type into storage sd:data for display macro
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
data modify storage sd:data type set value "Hopper"

# Initialize item0..item4 to empty strings
data modify storage sd:data item0 set value ""
data modify storage sd:data item1 set value ""
data modify storage sd:data item2 set value ""
data modify storage sd:data item3 set value ""
data modify storage sd:data item4 set value ""

# Populate item lines for occupied slots
execute if data block ~ ~ ~ Items[{Slot:0b}] run function storage_checker:check/set_item_0
execute if data block ~ ~ ~ Items[{Slot:1b}] run function storage_checker:check/set_item_1
execute if data block ~ ~ ~ Items[{Slot:2b}] run function storage_checker:check/set_item_2
execute if data block ~ ~ ~ Items[{Slot:3b}] run function storage_checker:check/set_item_3
execute if data block ~ ~ ~ Items[{Slot:4b}] run function storage_checker:check/set_item_4

# Summon display at centered location ~0.5 ~1 ~0.5
execute positioned ~0.5 ~1 ~0.5 run function storage_checker:display/summon with storage sd:data
