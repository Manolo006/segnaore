# ============================================
# Check Smoker for items (slots 0 and 2 only, excluding fuel slot 1)
# Slot 0 = Input, Slot 1 = Fuel (SKIP), Slot 2 = Output
# ============================================

# Skip if a display marker already exists at this position
execute if entity @e[type=minecraft:text_display,tag=sd.marker,dx=0,dy=0,dz=0] run return 0

# Count occupied non-fuel slots
scoreboard players set #count sd.var 0

# Check input slot (Slot 0)
execute store success score #temp sd.var run data get block ~ ~ ~ Items[{Slot:0b}]
scoreboard players operation #count sd.var += #temp sd.var

# Check output slot (Slot 2)
execute store success score #temp sd.var run data get block ~ ~ ~ Items[{Slot:2b}]
scoreboard players operation #count sd.var += #temp sd.var

# If no items in non-fuel slots, skip
execute unless score #count sd.var matches 1.. run return 0

# Store count and type for display macro
execute store result storage sd:data count int 1 run scoreboard players get #count sd.var
data modify storage sd:data type set value "Smoker"

# Summon the text display
function storage_checker:display/summon with storage sd:data
