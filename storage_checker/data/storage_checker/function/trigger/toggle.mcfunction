# ============================================
# Toggle text display scanning for player @s
# Runs as player @s at position @s
# ============================================

# Copy initial toggle score to temporary variable to prevent fallthrough bug
scoreboard players operation #current sd.var = @s sd.toggle

# If currently disabled (score 1), enable it
execute if score #current sd.var matches 1 run function storage_checker:trigger/enable_display

# If currently enabled/default (score not 1), disable it
execute unless score #current sd.var matches 1 run function storage_checker:trigger/disable_display
