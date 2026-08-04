# ============================================
# Storage Checker - Main Tick
# Runs every tick: scans for containers, manages displays
# ============================================

# Phase 1: Clean up displays too far from any player (6+ blocks)
function storage_checker:display/cleanup

# Phase 2: Verify existing displays still have items in their container
execute as @e[type=minecraft:text_display,tag=sd.marker] at @s run function storage_checker:display/verify

# Phase 3: Scan around each player for new containers with items
execute as @a at @s run function storage_checker:scan/grid
