# ============================================
# Trigger entry point for /trigger check_storage
# Runs as player @s at position @s
# ============================================

tellraw @s [{"text":"[Storage Checker] ","color":"gold","bold":true},{"text":"Scanning 5x5x5 area for non-blaze-rod items...","color":"yellow"}]

# Run 5x5x5 grid scan around player
function storage_checker:trigger/grid_5x5x5
