# ============================================
# Remove text displays that are 6+ blocks from ALL players
# ============================================
execute as @e[type=minecraft:text_display,tag=sd.marker] at @s unless entity @a[distance=..6] run kill @s
