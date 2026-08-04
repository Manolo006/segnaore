# ============================================
# Verify smoker still has items in non-fuel slots
# Runs as text_display, at its position (container is ~ ~-1 ~)
# ============================================

scoreboard players set #count sd.var 0

# Check input slot (Slot 0)
execute store success score #temp sd.var run data get block ~ ~-1 ~ Items[{Slot:0b}]
scoreboard players operation #count sd.var += #temp sd.var

# Check output slot (Slot 2)
execute store success score #temp sd.var run data get block ~ ~-1 ~ Items[{Slot:2b}]
scoreboard players operation #count sd.var += #temp sd.var

# If no items in non-fuel slots, remove the display
execute unless score #count sd.var matches 1.. run kill @s
