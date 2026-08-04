# ============================================
# Toggle text display scanning for player @s
# Runs as player @s at position @s
# ============================================

# If currently disabled (score 1), enable it (set to 0)
execute if score @s sd.toggle matches 1 run function storage_checker:trigger/enable_display
execute if score @s sd.toggle matches 1 run return 0

# Otherwise (score 0), disable it (set to 1)
function storage_checker:trigger/disable_display
