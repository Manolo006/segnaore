# ============================================
# Storage Checker - Main Tick
# Runs every tick: manages triggers, cleanup, verification, and scanning
# ============================================

# Enable /trigger commands for all players so non-OPs can run them
scoreboard players enable @a check_storage
scoreboard players enable @a toggle_storage

# Process /trigger check_storage calls
execute as @a[scores={check_storage=1..}] at @s run function storage_checker:trigger/run
scoreboard players reset @a[scores={check_storage=1..}] check_storage

# Process /trigger toggle_storage calls
execute as @a[scores={toggle_storage=1..}] at @s run function storage_checker:trigger/toggle
scoreboard players reset @a[scores={toggle_storage=1..}] toggle_storage

# Phase 1: Clean up displays too far from any player (6+ blocks)
function storage_checker:display/cleanup

# Phase 2: Verify existing displays still have items in their container
execute as @e[type=minecraft:text_display,tag=sd.marker] at @s run function storage_checker:display/verify

# Phase 3: Scan around players who have scanning ENABLED (sd.toggle is 0 or unassigned)
execute as @a[scores={sd.toggle=..0}] at @s run function storage_checker:scan/grid
