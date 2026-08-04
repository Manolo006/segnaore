# ============================================
# Check Hopper for items (all 5 slots)
# ============================================

# Skip if a display marker already exists near this block (display is at ~ ~1 ~)
execute if entity @e[type=minecraft:text_display,tag=sd.marker,distance=..1.5] run return 0

# Get the number of occupied item slots in the hopper
execute store result score #count sd.var run data get block ~ ~ ~ Items

# If no items, skip
execute unless score #count sd.var matches 1.. run return 0

# Calculate total quantity of items across all 5 slots
scoreboard players set #total sd.var 0

execute store result score #c sd.var run data get block ~ ~ ~ Items[0].count
execute unless score #c sd.var matches 1.. store result score #c sd.var run data get block ~ ~ ~ Items[0].Count
scoreboard players operation #total sd.var += #c sd.var

execute store result score #c sd.var run data get block ~ ~ ~ Items[1].count
execute unless score #c sd.var matches 1.. store result score #c sd.var run data get block ~ ~ ~ Items[1].Count
scoreboard players operation #total sd.var += #c sd.var

execute store result score #c sd.var run data get block ~ ~ ~ Items[2].count
execute unless score #c sd.var matches 1.. store result score #c sd.var run data get block ~ ~ ~ Items[2].Count
scoreboard players operation #total sd.var += #c sd.var

execute store result score #c sd.var run data get block ~ ~ ~ Items[3].count
execute unless score #c sd.var matches 1.. store result score #c sd.var run data get block ~ ~ ~ Items[3].Count
scoreboard players operation #total sd.var += #c sd.var

execute store result score #c sd.var run data get block ~ ~ ~ Items[4].count
execute unless score #c sd.var matches 1.. store result score #c sd.var run data get block ~ ~ ~ Items[4].Count
scoreboard players operation #total sd.var += #c sd.var

# Store count, total, type, and full Items compound (with stack counts & IDs) into storage sd:data
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
execute store result storage sd:data total int 1 run scoreboard players get #total sd.var
data modify storage sd:data type set value "Hopper"
data modify storage sd:data items set from block ~ ~ ~ Items

# Summon the text display
function storage_checker:display/summon with storage sd:data
