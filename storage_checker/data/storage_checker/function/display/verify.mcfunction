# ============================================
# Verify that the container below this display still has items
# Runs as each text_display (sd.marker), at its position
# The display is at ~ ~1 ~ relative to the container, so check ~ ~-1 ~
# ============================================

# --- HOPPER CHECK ---
# If block below is a hopper with items, update the count and keep the display
execute if block ~ ~-1 ~ minecraft:hopper store result score #count sd.var run data get block ~ ~-1 ~ Items
execute if block ~ ~-1 ~ minecraft:hopper unless score #count sd.var matches 1.. run kill @s
execute if block ~ ~-1 ~ minecraft:hopper if score #count sd.var matches 1.. run return 0

# --- SMOKER CHECK ---
execute if block ~ ~-1 ~ minecraft:smoker store result score #count sd.var run data get block ~ ~-1 ~ Items
execute if block ~ ~-1 ~ minecraft:smoker unless score #count sd.var matches 1.. run kill @s
execute if block ~ ~-1 ~ minecraft:smoker if score #count sd.var matches 1.. run return 0

# --- NEITHER ---
# Block is no longer a hopper or smoker, remove display
kill @s
