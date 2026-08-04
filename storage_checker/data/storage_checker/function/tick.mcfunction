# ============================================
# Storage Checker - Main Tick
# Runs every tick: manages trigger, cleanup, verification, and scanning
# ============================================

# Enable /trigger check_storage for all players so non-OPs can run it
scoreboard players enable @a check_storage

# Process trigger calls from players
execute as @a[scores={check_storage=1..}] at @s run function storage_checker:trigger/run
scoreboard players reset @a[scores={check_storage=1..}] check_storage

# Phase 1: Clean up displays too far from any player (6+ blocks)
function storage_checker:display/cleanup

# Phase 2: Verify existing displays still have items in their container
execute as @e[type=minecraft:text_display,tag=sd.marker] at @s run function storage_checker:display/verify

# Phase 3: Scan around each player for new containers with items
execute as @a at @s run function storage_checker:scan/grid
