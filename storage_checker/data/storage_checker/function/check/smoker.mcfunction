# ============================================
# Check Smoker for items (all 3 slots)
# ============================================

# Skip if a display marker already exists near this block (display is at ~ ~1 ~)
execute if entity @e[type=minecraft:text_display,tag=sd.marker,distance=..1.5] run return 0

# Get the number of occupied item slots in the smoker
execute store result score #count sd.var run data get block ~ ~ ~ Items

# If no items, skip
execute unless score #count sd.var matches 1.. run return 0

# Calculate total quantity of items across all 3 slots safely
scoreboard players set #total sd.var 0

# Slot 0 (Input)
scoreboard players set #c sd.var 0
execute store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:0b}].count
execute if score #c sd.var matches 0 store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:0b}].Count
scoreboard players operation #total sd.var += #c sd.var

# Slot 1 (Fuel)
scoreboard players set #c sd.var 0
execute store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:1b}].count
execute if score #c sd.var matches 0 store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:1b}].Count
scoreboard players operation #total sd.var += #c sd.var

# Slot 2 (Output)
scoreboard players set #c sd.var 0
execute store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:2b}].count
execute if score #c sd.var matches 0 store result score #c sd.var run data get block ~ ~ ~ Items[{Slot:2b}].Count
scoreboard players operation #total sd.var += #c sd.var

# Store count, total, type in sd:data
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
execute store result storage sd:data total int 1 run scoreboard players get #total sd.var
data modify storage sd:data type set value "Smoker"

# Build formatted items list (e.g. ["64x minecraft:bone", "32x minecraft:coal"])
data remove storage sd:data items
execute if data block ~ ~ ~ Items[{Slot:0b}] run function storage_checker:check/slot_0
execute if data block ~ ~ ~ Items[{Slot:1b}] run function storage_checker:check/slot_1
execute if data block ~ ~ ~ Items[{Slot:2b}] run function storage_checker:check/slot_2

# Summon the text display
function storage_checker:display/summon with storage sd:data
