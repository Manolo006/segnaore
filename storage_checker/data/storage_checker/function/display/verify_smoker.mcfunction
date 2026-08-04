# ============================================
# Verify smoker still has items (all slots)
# Runs as text_display (container is at ~ ~-1 ~)
# ============================================

# Get number of occupied slots in smoker
execute store result score #count sd.var run data get block ~ ~-1 ~ Items

# If no items in smoker, remove the display
execute unless score #count sd.var matches 1.. run kill @s
